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
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-32 w-32 rounded-full bg-[#00C853] flex items-start justify-center pt-3 shadow-lg">
              <span className="text-8xl font-bold text-white leading-none">m</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-semibold text-foreground">Registre. Consulte. Qualquer coisa.</p>
            <p className="text-sm text-muted-foreground">Start a conversation below</p>
          </div>
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
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-[#00C853] text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                message.role === "user" ? "bg-[#00C853] text-white" : "bg-muted/70 text-foreground"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>

            {message.role === "user" && (
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-muted/70">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
