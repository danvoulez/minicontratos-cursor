"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

type AuthScreenProps = {
  onAuth: (ownerId: string, tenantId: string) => void
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)

    // In production, this would call LogLine API for auth
    const ownerId = email.split("@")[0]
    const tenantId = email.split("@")[1]?.split(".")[0] || "minicontratos"

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    onAuth(ownerId, tenantId)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-white">MINI</span>
          <span className="text-emerald-500">CONTRATOS</span>
        </h1>
      </div>

      <div className="w-full max-w-md bg-[#1f1f1f] rounded-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-white">Bem-vindo ao Minicontratos</h2>
          <p className="text-gray-400 text-sm">Digite seu e-mail para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-gray-600"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-gray-100 text-black font-medium"
          >
            {isLoading ? "Entrando..." : "Confirmar"}
          </Button>
        </form>
      </div>
    </div>
  )
}
