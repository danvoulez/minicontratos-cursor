"use client"

import type React from "react"

import { Card } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { FileText, Code, Mail, Lightbulb, BookOpen, Briefcase } from "lucide-react"

interface Template {
  id: string
  title: string
  prompt: string
  icon: React.ReactNode
  category: string
}

const templates: Template[] = [
  {
    id: "1",
    title: "Explain a concept",
    prompt: "Explain [concept] in simple terms with examples",
    icon: <BookOpen className="h-4 w-4" />,
    category: "Learning",
  },
  {
    id: "2",
    title: "Write code",
    prompt: "Write a [language] function that [description]",
    icon: <Code className="h-4 w-4" />,
    category: "Development",
  },
  {
    id: "3",
    title: "Draft email",
    prompt: "Draft a professional email about [topic] to [recipient]",
    icon: <Mail className="h-4 w-4" />,
    category: "Writing",
  },
  {
    id: "4",
    title: "Brainstorm ideas",
    prompt: "Generate creative ideas for [project/topic]",
    icon: <Lightbulb className="h-4 w-4" />,
    category: "Creative",
  },
  {
    id: "5",
    title: "Summarize text",
    prompt: "Summarize the following text in [number] bullet points: [text]",
    icon: <FileText className="h-4 w-4" />,
    category: "Productivity",
  },
  {
    id: "6",
    title: "Business plan",
    prompt: "Help me create a business plan for [business idea]",
    icon: <Briefcase className="h-4 w-4" />,
    category: "Business",
  },
  {
    id: "7",
    title: "Debug code",
    prompt: "Help me debug this code: [paste code here]",
    icon: <Code className="h-4 w-4" />,
    category: "Development",
  },
  {
    id: "8",
    title: "Learn topic",
    prompt: "Create a learning plan for [topic] with resources and milestones",
    icon: <BookOpen className="h-4 w-4" />,
    category: "Learning",
  },
]

interface TemplateSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (prompt: string) => void
}

export function TemplateSelector({ open, onOpenChange, onSelectTemplate }: TemplateSelectorProps) {
  if (!open) return null

  const categories = Array.from(new Set(templates.map((t) => t.category)))

  return (
    <Card className="mb-3 p-4 max-h-[400px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Prompt Templates</h3>
        <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground text-sm">
          Close
        </button>
      </div>
      <ScrollArea className="h-[320px]">
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category}>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">{category}</h4>
              <div className="grid gap-2">
                {templates
                  .filter((t) => t.category === category)
                  .map((template) => (
                    <button
                      key={template.id}
                      onClick={() => onSelectTemplate(template.prompt)}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="mt-0.5 text-muted-foreground">{template.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">{template.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{template.prompt}</div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
