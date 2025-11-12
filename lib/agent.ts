"use server"

import { generateText, tool } from "ai"
import { z } from "zod"
import { SYSTEM_PROMPT } from "./agent-prompts"
import type { AgentTool } from "./agent-tools"
import { executeToolCall } from "./agent-tool-executor"

export interface ContractStructure {
  who: string[]
  did: string
  this: string
  when: string
  if_ok: string
  if_not: string
}

export interface AgentResponse {
  understanding: string
  contract: ContractStructure
  flows: string[]
  trust_score: number
  needs_clarification: boolean
  clarification_question: string | null
  tool_results?: any[]
}

const aiSdkTools = {
  create_flow: tool({
    description:
      "Creates a new flow/category for organizing contracts. Use when user wants to create a new type of record.",
    parameters: z.object({
      name: z.string().describe("Flow name (e.g., 'Vendas', 'Experimentos', 'Treinos')"),
      description: z.string().describe("Brief description of what this flow tracks"),
      icon: z.string().optional().describe("Emoji icon for the flow"),
    }),
  }),
  register_contract: tool({
    description: "Registers a new contract/record in a flow. Use when user describes something that happened.",
    parameters: z.object({
      flow_id: z.string().describe("ID of the flow to register in"),
      who: z.array(z.string()).describe("All people involved"),
      did: z.string().describe("What action happened"),
      this: z.record(z.any()).describe("Details about what happened (items, amounts, etc)"),
      when: z.string().describe("When it happened (ISO timestamp)"),
      if_ok: z.string().optional().describe("What should happen if agreement is fulfilled"),
      if_not: z.string().optional().describe("What should happen if agreement is NOT fulfilled"),
    }),
  }),
  search_contracts: tool({
    description: "Searches contracts in a flow with filters. Use when user asks questions about past records.",
    parameters: z.object({
      flow_id: z.string().optional().describe("Flow ID to search in (optional, searches all if not provided)"),
      person: z.string().optional().describe("Filter by person name"),
      date_from: z.string().optional().describe("Start date (ISO format)"),
      date_to: z.string().optional().describe("End date (ISO format)"),
      keyword: z.string().optional().describe("Search in contract details"),
    }),
  }),
  get_flows: tool({
    description: "Gets all flows created by the user. Use when user asks 'what flows do I have?' or 'show my flows'",
    parameters: z.object({}),
  }),
  render_chart: tool({
    description: "Renders a chart with data. Use when user asks for visualizations.",
    parameters: z.object({
      type: z.enum(["bar", "line", "pie"]).describe("Chart type"),
      data: z.array(z.any()).describe("Data points for the chart"),
      title: z.string().describe("Chart title"),
    }),
  }),
}

export async function processMessage(
  userMessage: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  model = "claude-3-5-sonnet-20241022",
  apiKey?: string,
): Promise<AgentResponse> {
  const modelString = `anthropic/${model}`

  try {
    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: userMessage,
      },
    ]

    const result = await generateText({
      model: modelString,
      system: SYSTEM_PROMPT,
      messages,
      tools: aiSdkTools,
      maxOutputTokens: 4096,
      temperature: 0.7,
    })

    const toolResults: any[] = []
    if (result.toolCalls && result.toolCalls.length > 0) {
      for (const toolCall of result.toolCalls) {
        console.log("[v0] Tool call:", toolCall.toolName, toolCall.args)
        const toolResult = await executeToolCall(toolCall.toolName as AgentTool, toolCall.args)
        toolResults.push({
          toolCallId: toolCall.toolCallId,
          toolName: toolCall.toolName,
          result: toolResult,
        })
      }

      // Return response after tool execution
      return {
        understanding: result.text || "Tools executed successfully",
        contract: {
          who: [],
          did: "tool_execution",
          this: result.text || JSON.stringify(toolResults),
          when: new Date().toISOString(),
          if_ok: "continue",
          if_not: "retry",
        },
        flows: [],
        trust_score: 1.0,
        needs_clarification: false,
        clarification_question: null,
        tool_results: toolResults,
      }
    }

    const jsonMatch = result.text.match(/```json\n([\s\S]*?)\n```/)
    if (!jsonMatch) {
      try {
        return JSON.parse(result.text)
      } catch {
        // If not valid JSON, return a default response with the text
        return {
          understanding: result.text,
          contract: {
            who: [],
            did: "conversation",
            this: result.text,
            when: new Date().toISOString(),
            if_ok: "continue",
            if_not: "clarify",
          },
          flows: [],
          trust_score: 0.8,
          needs_clarification: false,
          clarification_question: null,
        }
      }
    }

    const agentResponse: AgentResponse = JSON.parse(jsonMatch[1])
    return agentResponse
  } catch (error) {
    console.error("[v0] Agent processing error:", error)
    throw error
  }
}

export async function formatContractForDisplay(contract: ContractStructure): Promise<string> {
  return `**Quem:** ${contract.who.join(", ")}
**Fez:** ${contract.did}
**O que:** ${contract.this}
**Quando:** ${contract.when}
**Se ok:** ${contract.if_ok}
**Se não:** ${contract.if_not}`
}
