"use client"

import { useEffect } from "react"

/**
 * AuthScreen - Redirects to LogLine Auth Frontend
 * No UI, just redirects immediately to external auth
 */
export function AuthScreen() {
  useEffect(() => {
    // Get LogLine Auth Frontend URL from environment variable
    const authFrontendUrl = process.env.NEXT_PUBLIC_LOGLINE_AUTH_URL || process.env.NEXT_PUBLIC_AUTH_FRONTEND_URL
    const appId = process.env.NEXT_PUBLIC_LOGLINE_APP_ID || "minicontratos"
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`)
    
    if (!authFrontendUrl) {
      console.error("NEXT_PUBLIC_LOGLINE_AUTH_URL or NEXT_PUBLIC_AUTH_FRONTEND_URL must be set")
      return
    }
    
    // Immediate redirect to LogLine Auth Frontend
    window.location.href = `${authFrontendUrl}/auth?app_id=${appId}&redirect_uri=${redirectUri}`
  }, [])

  // Minimal loading state (should redirect immediately)
  return null
}
