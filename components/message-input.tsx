"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Send, Sparkles } from "lucide-react"
import { TemplateSelector } from "./template-selector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface MessageInputProps {
  onSendMessage: (content: string, model?: string) => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [input, setInput] = useState("")
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet-20241022")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim(), selectedModel)
      setInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  const handleTemplateSelect = (template: string) => {
    setInput(template)
    setShowTemplates(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="border-t p-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <TemplateSelector
          open={showTemplates}
          onOpenChange={setShowTemplates}
          onSelectTemplate={handleTemplateSelect}
        />
        <div className="flex gap-3 items-end">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="min-h-[56px] max-h-[200px] resize-none rounded-xl bg-muted/50 border-muted pr-[160px]"
              rows={1}
            />
            <div className="absolute right-3 top-3">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[140px] h-8 text-xs bg-background/80 backdrop-blur-sm border-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-3-5-sonnet-20241022">Sonnet 3.5</SelectItem>
                  <SelectItem value="claude-3-5-haiku-20241022">Haiku 3.5</SelectItem>
                  <SelectItem value="claude-3-opus-20240229">Opus 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* </CHANGE> */}
          <div className="flex gap-2">
            <Button
              onClick={() => setShowTemplates(!showTemplates)}
              variant="outline"
              size="icon"
              className="h-[56px] w-[56px] shrink-0 rounded-xl bg-muted/30 hover:bg-muted/50"
            >
              <Sparkles className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              size="icon"
              className="h-[56px] w-[56px] shrink-0 rounded-xl bg-[#00C853] hover:bg-[#00A843] disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-3">We trust and build with LogLine.</p>
      </div>
    </div>
  )
}
