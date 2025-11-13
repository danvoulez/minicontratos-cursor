"use client"

import { useState, useEffect } from "react"
import { createLogLineClient } from "@/lib/logline"

export type AuthUser = {
  email: string
  token: string
  ownerId: string
  tenantId: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("minicontratos_user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser(parsed)
      } catch (e) {
        console.error("Failed to parse stored user", e)
        localStorage.removeItem("minicontratos_user")
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: AuthUser) => {
    setUser(userData)
    localStorage.setItem("minicontratos_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("minicontratos_user")
  }

  const requestMagicLink = async (email: string) => {
    const client = createLogLineClient()
    return client.requestMagicLink(email)
  }

  const verifyAndLogin = async (token: string) => {
    const client = createLogLineClient()
    const result = await client.verifyToken(token)

    if (result.email || result.logline_id) {
      const email = result.email || `${result.logline_id}@logline.world`
      const ownerId = result.logline_id || result.email?.split("@")[0] || "unknown"
      const tenantId = result.email?.split("@")[1]?.split(".")[0] || "minicontratos"

      login({
        email,
        token, // JWT token from auth
        ownerId,
        tenantId,
      })
    }

    return result
  }

  const getGoogleOAuthUrl = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const redirectUri = `${appUrl}/auth/callback`
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://qo960fhrv0.execute-api.us-east-1.amazonaws.com"

    return `${apiUrl}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    requestMagicLink,
    verifyAndLogin,
    getGoogleOAuthUrl,
  }
}
