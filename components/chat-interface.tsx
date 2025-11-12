"use client"

import { useState, useEffect } from "react"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { ConversationList } from "./conversation-list"
import { Button } from "./ui/button"
import { PanelLeftClose, PanelLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthScreen } from "./auth-screen"
import {
  getConversations,
  createConversation,
  deleteConversation,
  updateConversation,
  getMessages,
  getFolders,
  createFolder,
  deleteFolder,
  updateFolder,
} from "@/app/actions/logline-actions"
import { createLogLineClient } from "@/lib/logline"
import { processUserMessage } from "@/app/actions/agent-actions"
import type { AgentResponse } from "@/lib/agent"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  folderId: string | null
}

export type Folder = {
  id: string
  name: string
  createdAt: Date
}

export function ChatInterface() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authData, setAuthData] = useState<{ email: string; token: string; ownerId: string; tenantId: string } | null>(
    null,
  )
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const { toast } = useToast()

  const activeConversation = conversations.find((c) => c.id === activeConversationId)

  useEffect(() => {
    const stored = localStorage.getItem("minicontratos_auth")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setAuthData(parsed)
        setIsAuthenticated(true)
      } catch (e) {
        console.error("[v0] Failed to parse stored auth", e)
      }
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && authData) {
      loadData()
    }
  }, [isAuthenticated, authData])

  const loadData = async () => {
    if (!authData) return

    try {
      setLoading(true)

      const [foldersRes, conversationsRes] = await Promise.all([getFolders(), getConversations()])

      if (!foldersRes.success || !conversationsRes.success) {
        throw new Error(foldersRes.error || conversationsRes.error || "Failed to load data")
      }

      if (foldersRes.data) {
        setFolders(
          foldersRes.data.map((f: any) => ({
            id: f.id,
            name: f.name,
            createdAt: new Date(f.created_at),
          })),
        )
      }

      if (conversationsRes.data) {
        setConversations(
          conversationsRes.data.map((c: any) => ({
            id: c.id,
            title: c.title,
            messages: [],
            createdAt: new Date(c.created_at),
            updatedAt: new Date(c.updated_at),
            folderId: c.folder_id,
          })),
        )
      }
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load conversations. Check LOGLINE_API_KEY in Vars section.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMessagesData = async (conversationId: string) => {
    if (!authData) return

    try {
      setLoadingMessages(true)
      const response = await getMessages(conversationId, 50)

      if (!response.success) {
        throw new Error(response.error)
      }

      if (response.data) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: response.data.map((m: any) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    timestamp: new Date(m.timestamp),
                  })),
                }
              : conv,
          ),
        )
      }
    } catch (error) {
      console.error("[v0] Error loading messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleNewConversation = async () => {
    if (!authData) return

    try {
      console.log("[v0] handleNewConversation called")
      const response = await createConversation("New Conversation")
      console.log("[v0] handleNewConversation response:", response)

      if (!response.success) {
        throw new Error(response.error || "Failed to create conversation")
      }

      if (!response.data) {
        throw new Error("No conversation data returned")
      }

      const newConversation: Conversation = {
        id: response.data.id,
        title: response.data.title || "New Conversation",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        folderId: null,
      }

      console.log("[v0] Adding new conversation:", newConversation)
      setConversations((prev) => [newConversation, ...prev])
      setActiveConversationId(newConversation.id)
    } catch (error) {
      console.error("[v0] Error creating conversation:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create conversation"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleDeleteConversation = async (id: string) => {
    if (!authData) return

    try {
      const response = await deleteConversation(id)

      if (!response.success) {
        throw new Error(response.error)
      }

      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeConversationId === id) {
        setActiveConversationId(null)
      }
    } catch (error) {
      console.error("[v0] Error deleting conversation:", error)
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      })
    }
  }

  const handleCreateFolder = async (name: string) => {
    if (!authData) return

    try {
      const response = await createFolder(name)

      if (!response.success || !response.data) {
        throw new Error(response.error)
      }

      const newFolder: Folder = {
        id: response.data.id,
        name: response.data.name,
        createdAt: new Date(),
      }
      setFolders((prev) => [...prev, newFolder])
    } catch (error) {
      console.error("[v0] Error creating folder:", error)
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFolder = async (id: string) => {
    if (!authData) return

    try {
      const response = await deleteFolder(id)

      if (!response.success) {
        throw new Error(response.error)
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.folderId === id
            ? {
                ...conv,
                folderId: null,
              }
            : conv,
        ),
      )
      setFolders((prev) => prev.filter((f) => f.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting folder:", error)
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      })
    }
  }

  const handleRenameFolder = async (id: string, newName: string) => {
    if (!authData) return

    try {
      const response = await updateFolder(id, newName)

      if (!response.success) {
        throw new Error(response.error)
      }

      setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name: newName } : f)))
    } catch (error) {
      console.error("[v0] Error renaming folder:", error)
      toast({
        title: "Error",
        description: "Failed to rename folder",
        variant: "destructive",
      })
    }
  }

  const handleMoveToFolder = async (conversationId: string, folderId: string | null) => {
    if (!authData) return

    try {
      const response = await updateConversation(conversationId, {
        folder_id: folderId,
      })

      if (!response.success) {
        throw new Error(response.error)
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                folderId,
              }
            : conv,
        ),
      )
    } catch (error) {
      console.error("[v0] Error moving conversation:", error)
      toast({
        title: "Error",
        description: "Failed to move conversation",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async (content: string, model?: string) => {
    if (!authData) return

    if (!activeConversationId) {
      await handleNewConversation()
      return
    }

    const userMessage: Message = {
      id: `temp_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }

    // Optimistic update
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          const updatedMessages = [...conv.messages, userMessage]
          const title =
            conv.messages.length === 0 ? content.slice(0, 50) + (content.length > 50 ? "..." : "") : conv.title

          return {
            ...conv,
            messages: updatedMessages,
            title,
            updatedAt: new Date(),
          }
        }
        return conv
      }),
    )

    try {
      const userApiKey = localStorage.getItem("anthropic_api_key") || undefined

      // Get conversation history for context
      const conversationHistory =
        activeConversation?.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })) || []

      const agentResult = await processUserMessage(content, conversationHistory, model, userApiKey)

      if (!agentResult.success || !agentResult.data) {
        throw new Error(agentResult.error)
      }

      const agentResponse: AgentResponse = agentResult.data

      // Format AI response with contract structure
      let aiContent = `${agentResponse.understanding}\n\n`

      if (agentResponse.needs_clarification) {
        aiContent += `❓ ${agentResponse.clarification_question}`
      } else {
        aiContent += `📋 **Contrato estruturado:**\n`
        aiContent += `**Quem:** ${agentResponse.contract.who.join(", ")}\n`
        aiContent += `**Fez:** ${agentResponse.contract.did}\n`
        aiContent += `**O que:** ${agentResponse.contract.this}\n`
        aiContent += `**Quando:** ${agentResponse.contract.when}\n`
        aiContent += `**Se ok:** ${agentResponse.contract.if_ok}\n`
        aiContent += `**Se não:** ${agentResponse.contract.if_not}\n\n`
        aiContent += `🏷️ **Flows:** ${agentResponse.flows.join(", ")}\n`
        aiContent += `🎯 **Confiança:** ${(agentResponse.trust_score * 100).toFixed(0)}%`
      }

      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                updatedAt: new Date(),
                title:
                  conv.messages.length === 1 ? content.slice(0, 50) + (content.length > 50 ? "..." : "") : conv.title,
              }
            : conv,
        ),
      )
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
  }

  const handleAuth = (email: string, token: string) => {
    const ownerId = email.split("@")[0]
    const tenantId = email.split("@")[1]?.split(".")[0] || "minicontratos"

    const data = { email, token, ownerId, tenantId }
    setAuthData(data)
    setIsAuthenticated(true)
    localStorage.setItem("minicontratos_auth", JSON.stringify(data))
  }

  const handleRequestMagicLink = async (email: string) => {
    const client = createLogLineClient()
    await client.requestMagicLink(email)
  }

  const handleFlowClick = async (flowName: string) => {
    if (!authData) return

    try {
      // Create new conversation
      const response = await createConversation(`Summary: ${flowName}`)

      if (!response.success || !response.data) {
        throw new Error(response.error)
      }

      const newConversation: Conversation = {
        id: response.data.id,
        title: `Summary: ${flowName}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        folderId: null,
      }

      setConversations((prev) => [newConversation, ...prev])
      setActiveConversationId(newConversation.id)

      // Immediately send message with flow name for summary
      setTimeout(() => {
        handleSendMessage(flowName)
      }, 100)
    } catch (error) {
      console.error("[v0] Error creating conversation from flow:", error)
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated || !authData) {
    return <AuthScreen onAuth={handleAuth} onRequestMagicLink={handleRequestMagicLink} />
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-0"} border-r bg-muted/30 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Conversations</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Loading...</p>
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              folders={folders}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onCreateFolder={handleCreateFolder}
              onDeleteFolder={handleDeleteFolder}
              onRenameFolder={handleRenameFolder}
              onMoveToFolder={handleMoveToFolder}
              userName={authData.ownerId}
              userRole="Member"
              onFlowClick={handleFlowClick}
            />
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b px-4 py-3 flex items-center gap-2">
          {!sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="font-semibold">{activeConversation?.title || "New Conversation"}</h1>
          {loadingMessages && <span className="text-xs text-muted-foreground ml-auto">Loading messages...</span>}
        </header>

        {/* Messages */}
        <MessageList messages={activeConversation?.messages || []} />

        {/* Input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </main>
    </>
  )
}
