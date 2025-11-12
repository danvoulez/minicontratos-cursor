"use server"

import { SYSTEM_PROMPT } from "./agent-prompts"
import { executeToolCall } from "./agent-tool-executor"
import type { AgentTool } from "./agent-tools"

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

const ANTHROPIC_TOOLS = [
  {
    name: "create_flow",
    description:
      "Creates a new flow/category for organizing contracts. Use when user wants to create a new type of record.",
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Flow name (e.g., 'Vendas', 'Experimentos', 'Treinos')",
        },
        description: {
          type: "string",
          description: "Brief description of what this flow tracks",
        },
        icon: {
          type: "string",
          description: "Emoji icon for the flow",
        },
      },
      required: ["name", "description"],
    },
  },
  {
    name: "register_contract",
    description: "Registers a new contract/record in a flow. Use when user describes something that happened.",
    input_schema: {
      type: "object",
      properties: {
        flow_id: {
          type: "string",
          description: "ID of the flow to register in",
        },
        who: {
          type: "string",
          description: "All people involved (comma-separated)",
        },
        did: {
          type: "string",
          description: "What action happened",
        },
        details: {
          type: "string",
          description: "Details about what happened (items, amounts, etc)",
        },
        when: {
          type: "string",
          description: "When it happened (ISO timestamp)",
        },
        if_ok: {
          type: "string",
          description: "What should happen if agreement is fulfilled",
        },
        if_not: {
          type: "string",
          description: "What should happen if agreement is NOT fulfilled",
        },
      },
      required: ["flow_id", "who", "did", "details", "when"],
    },
  },
  {
    name: "search_contracts",
    description: "Searches contracts in a flow with filters. Use when user asks questions about past records.",
    input_schema: {
      type: "object",
      properties: {
        flow_id: {
          type: "string",
          description: "Flow ID to search in (searches all flows if not provided)",
        },
        person: {
          type: "string",
          description: "Filter by person name",
        },
        date_from: {
          type: "string",
          description: "Start date (ISO format)",
        },
        date_to: {
          type: "string",
          description: "End date (ISO format)",
        },
        keyword: {
          type: "string",
          description: "Search in contract details",
        },
      },
      required: [],
    },
  },
  {
    name: "render_chart",
    description: "Renders a chart with data. Use when user asks for visualizations.",
    input_schema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["bar", "line", "pie"],
          description: "Chart type",
        },
        data: {
          type: "string",
          description: "Data points for the chart as JSON string",
        },
        title: {
          type: "string",
          description: "Chart title",
        },
      },
      required: ["type", "data", "title"],
    },
  },
]

export async function processMessage(
  userMessage: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  model = "claude-3-5-sonnet-20241022",
  apiKey?: string,
): Promise<AgentResponse> {
  const anthropicApiKey = apiKey || process.env.ANTHROPIC_API_KEY

  if (!anthropicApiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured")
  }

  try {
    console.log("[v0] Calling Anthropic API directly")

    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: userMessage,
      },
    ]

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages,
        tools: ANTHROPIC_TOOLS,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Anthropic API error:", errorText)
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("[v0] Anthropic response:", JSON.stringify(result, null, 2))

    // Handle tool use
    if (result.stop_reason === "tool_use") {
      const toolResults: any[] = []

      for (const content of result.content) {
        if (content.type === "tool_use") {
          console.log("[v0] Tool call:", content.name, content.input)
          const toolResult = await executeToolCall(content.name as AgentTool, content.input)
          toolResults.push({
            toolCallId: content.id,
            toolName: content.name,
            result: toolResult,
          })
        }
      }

      // Get text response from assistant
      const textContent = result.content.find((c: any) => c.type === "text")
      const assistantText = textContent?.text || "Action completed successfully"

      return {
        understanding: assistantText,
        contract: {
          who: [],
          did: "tool_execution",
          this: assistantText,
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

    // Handle regular text response
    const textContent = result.content.find((c: any) => c.type === "text")
    const assistantText = textContent?.text || ""

    return {
      understanding: assistantText,
      contract: {
        who: [],
        did: "conversation",
        this: assistantText,
        when: new Date().toISOString(),
        if_ok: "continue",
        if_not: "clarify",
      },
      flows: [],
      trust_score: 0.8,
      needs_clarification: false,
      clarification_question: null,
    }
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
