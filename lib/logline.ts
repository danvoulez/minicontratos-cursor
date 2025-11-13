// LogLine API Client

const LOGLINE_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://qo960fhrv0.execute-api.us-east-1.amazonaws.com"
const LOGLINE_API_KEY = process.env.LOGLINE_API_KEY

export type SpanIntent = "llm_chat" | "query" | "install" | "update" | "delete"
export type SpanPayload = {
  span: {
    id?: string
    context: string // Made context mandatory
    response: string // Made response mandatory
    intent?: string
    payload?: Record<string, any>
    metadata?: Record<string, any>
    timestamp?: string
  }
}

export type SpanResponse = {
  span_id: string
  trace_id: string
  result?: any
  error?: string
}

class LogLineClient {
  private apiKey: string | null
  private jwtToken: string | null
  private baseUrl: string

  constructor(apiKey: string | null = null, jwtToken: string | null = null, baseUrl: string = LOGLINE_API_URL) {
    this.apiKey = apiKey || LOGLINE_API_KEY || null
    this.jwtToken = jwtToken || null
    this.baseUrl = baseUrl
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  setJwtToken(token: string) {
    this.jwtToken = token
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    }

    // Priority: JWT token > API key
    if (this.jwtToken) {
      headers.Authorization = `Bearer ${this.jwtToken}`
    } else if (this.apiKey) {
      headers.Authorization = `ApiKey ${this.apiKey}`
    }

    console.log("[v0] LogLine request:", { url, hasJwt: !!this.jwtToken, hasApiKey: !!this.apiKey })

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      throw new Error("Unauthorized - Invalid token or API key")
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "")
      console.error("[v0] LogLine API error:", { status: response.status, body: errorBody })
      throw new Error(`API error: ${response.status} - ${errorBody || response.statusText}`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return response.json()
    }

    return response.text()
  }

  // Auth operations
  async requestMagicLink(email: string): Promise<any> {
    return this.request("/auth/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async verifyToken(token: string): Promise<any> {
    return this.request(`/auth/verify?token=${token}`, {
      method: "GET",
    })
  }

  // Onboarding
  async onboardApp(appName: string, email: string): Promise<any> {
    return this.request("/onboarding", {
      method: "POST",
      body: JSON.stringify({ app_name: appName, email }),
    })
  }

  // Span operations
  private generateSpanId(): string {
    return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async writeSpan(spanData: SpanPayload): Promise<SpanResponse> {
    if (!spanData.span.context) {
      throw new Error("Span must have a context")
    }
    if (!spanData.span.response) {
      throw new Error("Span must have a response")
    }

    const spanWithId = {
      span: {
        id: spanData.span.id || this.generateSpanId(),
        timestamp: spanData.span.timestamp || new Date().toISOString(),
        ...spanData.span,
      },
    }

    return this.request("/spans", {
      method: "POST",
      body: JSON.stringify(spanWithId),
    })
  }

  async getSpans(params?: { type?: string; limit?: number }): Promise<any> {
    const queryParams = new URLSearchParams()
    if (params?.type) queryParams.append("type", params.type)
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const queryString = queryParams.toString()
    return this.request(`/spans${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    })
  }

  async sendMessage(
    message: string,
    conversationId?: string,
    model = "claude-3-5-sonnet-20241022",
    userApiKey?: string,
  ): Promise<SpanResponse> {
    // Use user's API key if provided, otherwise check environment, otherwise use default
    const anthropicKey = userApiKey || process.env.ANTHROPIC_API_KEY || undefined

    return this.writeSpan({
      span: {
        context: `Send message to conversation ${conversationId || "new"}: ${message}`,
        response: JSON.stringify({ status: "pending", model }),
        intent: "llm_chat",
        payload: {
          message,
          conversation_id: conversationId,
          model,
          provider: "anthropic",
          anthropic_api_key: anthropicKey,
        },
        metadata: {
          app: "minicontratos",
          type: "message_sent",
          trace_id: conversationId || `trace_${Date.now()}`,
          model,
          has_user_key: !!userApiKey,
        },
      },
    })
  }

  async getConversations(filters?: {
    folder_id?: string
    date_from?: string
    date_to?: string
    limit?: number
  }): Promise<any> {
    const filterDesc = filters ? JSON.stringify(filters) : "all"
    return this.writeSpan({
      span: {
        context: `Query conversations with filters: ${filterDesc}`,
        response: JSON.stringify({ status: "querying", filters }),
        intent: "query",
        payload: {
          entity_type: "conversation",
          ...filters,
        },
        metadata: {
          app: "minicontratos",
          type: "conversation_list",
        },
      },
    })
  }

  async getMessages(conversationId: string, limit?: number): Promise<any> {
    return this.writeSpan({
      span: {
        context: `Load messages for conversation ${conversationId}${limit ? ` (limit: ${limit})` : ""}`,
        response: JSON.stringify({ status: "loading", conversation_id: conversationId }),
        intent: "query",
        payload: {
          entity_type: "message",
          conversation_id: conversationId,
          limit,
        },
        metadata: {
          app: "minicontratos",
          type: "message_list",
          conversation_id: conversationId,
        },
      },
    })
  }

  async createConversation(title: string, folderId?: string): Promise<any> {
    return this.writeSpan({
      span: {
        context: `Create new conversation: ${title}${folderId ? ` in folder ${folderId}` : ""}`,
        response: JSON.stringify({ title, folder_id: folderId }),
        intent: "install",
        payload: {
          entity_type: "conversation",
          title,
          folder_id: folderId,
        },
        metadata: {
          app: "minicontratos",
          type: "conversation_created",
        },
      },
    })
  }

  async updateConversation(
    conversationId: string,
    updates: {
      title?: string
      folder_id?: string | null
    },
  ): Promise<any> {
    return this.writeSpan({
      span: {
        context: `Update conversation ${conversationId}: ${JSON.stringify(updates)}`,
        response: JSON.stringify({ conversation_id: conversationId, updates }),
        intent: "update",
        payload: {
          entity_type: "conversation",
          conversation_id: conversationId,
          ...updates,
        },
        metadata: {
          app: "minicontratos",
          type: "conversation_updated",
          conversation_id: conversationId,
        },
      },
    })
  }

  async deleteConversation(conversationId: string): Promise<any> {
    return this.writeSpan({
      span: {
        context: `Delete conversation ${conversationId}`,
        response: JSON.stringify({ conversation_id: conversationId, deleted: true }),
        intent: "delete",
        payload: {
          entity_type: "conversation",
          conversation_id: conversationId,
        },
        metadata: {
          app: "minicontratos",
          type: "conversation_deleted",
          conversation_id: conversationId,
        },
      },
    })
  }

  async getFolders(): Promise<any> {
    return this.writeSpan({
      span: {
        context: "Query all folders",
        response: JSON.stringify({ status: "querying" }),
        intent: "query",
        payload: {
          entity_type: "folder",
        },
        metadata: {
          app: "minicontratos",
          type: "folder_list",
        },
      },
    })
  }

  async createFolder(name: string): Promise<any> {
    return this.writeSpan({
      span: {
        context: `Create new folder: ${name}`,
        response: JSON.stringify({ name }),
        intent: "install",
        payload: {
          entity_type: "folder",
          name,
        },
        metadata: {
          app: "minicontratos",
          type: "folder_created",
        },
      },
    })
  }

  async updateFolder(folderId: string, name: string): Promise<any> {
    return this.writeSpan({
      span: {
        context: `Update folder ${folderId} to name: ${name}`,
        response: JSON.stringify({ folder_id: folderId, name }),
        intent: "update",
        payload: {
          entity_type: "folder",
          folder_id: folderId,
          name,
        },
        metadata: {
          app: "minicontratos",
          type: "folder_updated",
          folder_id: folderId,
        },
      },
    })
  }

  async deleteFolder(folderId: string): Promise<any> {
    return this.writeSpan({
      span: {
        context: `Delete folder ${folderId}`,
        response: JSON.stringify({ folder_id: folderId, deleted: true }),
        intent: "delete",
        payload: {
          entity_type: "folder",
          folder_id: folderId,
        },
        metadata: {
          app: "minicontratos",
          type: "folder_deleted",
          folder_id: folderId,
        },
      },
    })
  }

  async searchConversations(query: string): Promise<any> {
    return this.writeSpan({
      span: {
        context: `Search conversations for: ${query}`,
        response: JSON.stringify({ query, status: "searching" }),
        intent: "query",
        payload: {
          entity_type: "conversation",
          search: query,
        },
        metadata: {
          app: "minicontratos",
          type: "conversation_search",
        },
      },
    })
  }
}

export function createLogLineClient(apiKey: string | null = null, jwtToken: string | null = null): LogLineClient {
  return new LogLineClient(apiKey, jwtToken)
}

export { LogLineClient }
