"use server"

import { createLogLineClient } from "@/lib/logline"

const getApiKey = () => {
  const apiKey = process.env.LOGLINE_API_KEY
  if (!apiKey) {
    return "demo_key"
  }
  return apiKey
}

// Conversation actions
export async function getConversations(
  ownerId: string,
  tenantId: string,
  filters?: {
    folder_id?: string
    date_from?: string
    date_to?: string
    limit?: number
  },
) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    const response = await client.getConversations(filters)
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] getConversations error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createConversation(ownerId: string, tenantId: string, title: string, folderId?: string) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    const response = await client.createConversation(title, folderId)
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] createConversation error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteConversation(ownerId: string, tenantId: string, conversationId: string) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    await client.deleteConversation(conversationId)
    return { success: true }
  } catch (error) {
    console.error("[v0] deleteConversation error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateConversation(
  ownerId: string,
  tenantId: string,
  conversationId: string,
  updates: {
    title?: string
    folder_id?: string | null
  },
) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    await client.updateConversation(conversationId, updates)
    return { success: true }
  } catch (error) {
    console.error("[v0] updateConversation error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Message actions
export async function getMessages(ownerId: string, tenantId: string, conversationId: string, limit?: number) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    const response = await client.getMessages(conversationId, limit)
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] getMessages error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendMessage(
  ownerId: string,
  tenantId: string,
  message: string,
  conversationId?: string,
  model?: string,
) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    const response = await client.sendMessage(message, conversationId, model)
    return { success: true, data: response.result, spanId: response.span_id }
  } catch (error) {
    console.error("[v0] sendMessage error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Folder actions
export async function getFolders(ownerId: string, tenantId: string) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    const response = await client.getFolders()
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] getFolders error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createFolder(ownerId: string, tenantId: string, name: string) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    const response = await client.createFolder(name)
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] createFolder error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteFolder(ownerId: string, tenantId: string, folderId: string) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    await client.deleteFolder(folderId)
    return { success: true }
  } catch (error) {
    console.error("[v0] deleteFolder error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateFolder(ownerId: string, tenantId: string, folderId: string, name: string) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    await client.updateFolder(folderId, name)
    return { success: true }
  } catch (error) {
    console.error("[v0] updateFolder error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Search action
export async function searchConversations(ownerId: string, tenantId: string, query: string) {
  try {
    const client = createLogLineClient(ownerId, tenantId, getApiKey())
    const response = await client.searchConversations(query)
    return { success: true, data: response.result }
  } catch (error) {
    console.error("[v0] searchConversations error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
