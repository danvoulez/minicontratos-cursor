// LogLine API Client

const LOGLINE_API_URL = "https://logline.ngrok.app/api"

export type SpanIntent = "llm_chat" | "query" | "install" | "update" | "delete"

export type Span = {
  intent: SpanIntent
  payload: Record<string, any>
  metadata?: {
    owner_id?: string
    tenant_id?: string
    trace_id?: string
    parent_id?: string
    [key: string]: any
  }
}

export type SpanResponse = {
  span_id: string
  trace_id: string
  result?: any
  error?: string
}

class LogLineClient {
  private ownerId: string
  private tenantId: string
  private baseUrl: string
  private apiKey: string

  constructor(ownerId: string, tenantId: string, apiKey: string, baseUrl: string = LOGLINE_API_URL) {
    this.ownerId = ownerId
    this.tenantId = tenantId
    this.apiKey = apiKey
    this.baseUrl = baseUrl
    console.log("[v0] LogLineClient initialized with baseUrl:", baseUrl)
    console.log("[v0] Owner ID:", ownerId, "Tenant ID:", tenantId)
    console.log("[v0] API Key present:", !!apiKey)
  }

  async sendSpan(span: Span, wait = true): Promise<SpanResponse> {
    const url = `${this.baseUrl}${wait ? "?wait=true" : ""}`

    const spanWithAuth: Span = {
      ...span,
      metadata: {
        owner_id: this.ownerId,
        tenant_id: this.tenantId,
        ...span.metadata,
      },
    }

    console.log("[v0] Sending span to:", url)
    console.log("[v0] Span intent:", span.intent)
    console.log("[v0] Span metadata:", spanWithAuth.metadata)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${this.apiKey}`,
      },
      body: JSON.stringify(spanWithAuth),
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error("[v0] API error body:", errorBody)
      throw new Error(`LogLine API error: ${response.status} - ${errorBody}`)
    }

    return response.json()
  }

  // Chat operations
  async sendMessage(message: string, conversationId?: string, model = "gpt-4"): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "llm_chat",
      payload: {
        message,
        conversation_id: conversationId,
        model,
      },
      metadata: {
        trace_id: conversationId || `trace_${Date.now()}`,
      },
    })
  }

  // Query operations
  async getConversations(filters?: {
    folder_id?: string
    date_from?: string
    date_to?: string
    limit?: number
  }): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "query",
      payload: {
        entity_type: "conversation",
        ...filters,
      },
    })
  }

  async getMessages(conversationId: string, limit?: number): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "query",
      payload: {
        entity_type: "message",
        conversation_id: conversationId,
        limit,
      },
    })
  }

  async getFolders(): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "query",
      payload: {
        entity_type: "folder",
      },
    })
  }

  // Install operations (create)
  async createConversation(title: string, folderId?: string): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "install",
      payload: {
        entity_type: "conversation",
        title,
        folder_id: folderId,
      },
    })
  }

  async createFolder(name: string): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "install",
      payload: {
        entity_type: "folder",
        name,
      },
    })
  }

  // Update operations
  async updateConversation(
    conversationId: string,
    updates: {
      title?: string
      folder_id?: string | null
    },
  ): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "update",
      payload: {
        entity_type: "conversation",
        conversation_id: conversationId,
        ...updates,
      },
    })
  }

  async updateFolder(folderId: string, name: string): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "update",
      payload: {
        entity_type: "folder",
        folder_id: folderId,
        name,
      },
    })
  }

  // Delete operations
  async deleteConversation(conversationId: string): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "delete",
      payload: {
        entity_type: "conversation",
        conversation_id: conversationId,
      },
    })
  }

  async deleteFolder(folderId: string): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "delete",
      payload: {
        entity_type: "folder",
        folder_id: folderId,
      },
    })
  }

  // Search
  async searchConversations(query: string): Promise<SpanResponse> {
    return this.sendSpan({
      intent: "query",
      payload: {
        entity_type: "conversation",
        search: query,
      },
    })
  }
}

export function createLogLineClient(ownerId: string, tenantId: string, apiKey: string): LogLineClient {
  return new LogLineClient(ownerId, tenantId, apiKey)
}

export { LogLineClient }
