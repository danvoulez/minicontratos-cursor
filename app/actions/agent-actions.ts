"use server"

import { processMessage, type AgentResponse } from "@/lib/agent"
import { createLogLineClient } from "@/lib/logline"

export async function processUserMessage(
  message: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  model?: string,
  userApiKey?: string,
): Promise<{ success: boolean; data?: AgentResponse; error?: string }> {
  try {
    const agentResponse = await processMessage(message, conversationHistory, model, userApiKey)

    // Create audit span in LogLine
    const apiKey = process.env.LOGLINE_API_KEY
    if (apiKey) {
      const client = createLogLineClient(apiKey)

      await client.writeSpan({
        span: {
          context: message,
          response: JSON.stringify(agentResponse),
          intent: "llm_chat",
          payload: {
            message,
            agent_response: agentResponse,
          },
          metadata: {
            app: "minicontratos",
            type: "agent_interaction",
            trust_score: agentResponse.trust_score,
            tools_used: agentResponse.tool_results?.length || 0,
          },
        },
      })
    }

    return { success: true, data: agentResponse }
  } catch (error) {
    console.error("[v0] processUserMessage error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process message",
    }
  }
}
