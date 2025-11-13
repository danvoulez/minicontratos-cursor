"use server"

import { createLogLineClient } from "@/lib/logline"
import { cookies } from "next/headers"

const getClient = async () => {
  // Try to get JWT token from cookies (set after auth)
  const cookieStore = await cookies()
  const jwtToken = cookieStore.get("logline_token")?.value || null
  
  // Fallback to API key if no JWT token
  const apiKey = process.env.LOGLINE_API_KEY || null
  
  if (!jwtToken && !apiKey) {
    throw new Error("No authentication available. Please log in or configure LOGLINE_API_KEY")
  }
  
  return createLogLineClient(apiKey, jwtToken)
}

// Conversation actions
export async function getConversations(filters?: {
  folder_id?: string
  date_from?: string
  date_to?: string
  limit?: number
}) {
  try {
    const client = await getClient()
    const response = await client.getConversations(filters)
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] getConversations error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createConversation(title: string, folderId?: string) {
  try {
    console.log("[v0] createConversation called:", { title, folderId })
    const client = await getClient()
    const response = await client.createConversation(title, folderId)
    console.log("[v0] createConversation response:", response)

    if (!response) {
      throw new Error("No response from API")
    }

    // Check if response has result property or is the result itself
    const result = response.result || response

    // If result is missing required fields, create a minimal conversation object
    const conversationData = result?.id
      ? result
      : {
          id: response.span_id || `conv_${Date.now()}`,
          title,
          folder_id: folderId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

    console.log("[v0] createConversation final data:", conversationData)
    return { success: true, data: conversationData }
  } catch (error) {
    console.error("[v0] createConversation error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, error: errorMessage || "Unknown error creating conversation" }
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    const client = await getClient()
    await client.deleteConversation(conversationId)
    return { success: true }
  } catch (error) {
    console.error("[v0] deleteConversation error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateConversation(
  conversationId: string,
  updates: {
    title?: string
    folder_id?: string | null
  },
) {
  try {
    const client = await getClient()
    await client.updateConversation(conversationId, updates)
    return { success: true }
  } catch (error) {
    console.error("[v0] updateConversation error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Message actions
export async function getMessages(conversationId: string, limit?: number) {
  try {
    const client = await getClient()
    const response = await client.getMessages(conversationId, limit)
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] getMessages error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendMessage(message: string, conversationId?: string, model?: string, userApiKey?: string) {
  try {
    const client = await getClient()
    // Pass model and userApiKey to the client's sendMessage method
    const response = await client.sendMessage(message, conversationId, model, userApiKey)
    return { success: true, data: response.result, spanId: response.span_id }
  } catch (error) {
    console.error("[v0] sendMessage error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Folder actions
export async function getFolders() {
  try {
    const client = await getClient()
    const response = await client.getFolders()
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] getFolders error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createFolder(name: string) {
  try {
    const client = await getClient()
    const response = await client.createFolder(name)
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] createFolder error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteFolder(folderId: string) {
  try {
    const client = await getClient()
    await client.deleteFolder(folderId)
    return { success: true }
  } catch (error) {
    console.error("[v0] deleteFolder error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateFolder(folderId: string, name: string) {
  try {
    const client = await getClient()
    await client.updateFolder(folderId, name)
    return { success: true }
  } catch (error) {
    console.error("[v0] updateFolder error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Search action
export async function searchConversations(query: string) {
  try {
    const client = await getClient()
    const response = await client.searchConversations(query)
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] searchConversations error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
