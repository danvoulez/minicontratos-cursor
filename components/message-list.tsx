"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "./ui/scroll-area"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { User, Bot } from "lucide-react"
import type { Message } from "./chat-interface"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <Bot className="h-12 w-12 mx-auto opacity-50" />
          <p className="text-lg font-medium">Start a conversation</p>
          <p className="text-sm">Type a message below to begin</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 px-4">
      <div ref={scrollRef} className="max-w-3xl mx-auto py-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`rounded-lg px-4 py-3 max-w-[80%] ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>

            {message.role === "user" && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-muted">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
