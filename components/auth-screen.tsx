"use client"

import { useEffect } from "react"

type AuthScreenProps = {
  onAuth: (email: string, token: string) => void
  onRequestMagicLink: (email: string) => Promise<void>
}

export function AuthScreen({ onAuth, onRequestMagicLink }: AuthScreenProps) {
  useEffect(() => {
    // Redirect to LogLine Auth Frontend
    const authFrontendUrl = process.env.NEXT_PUBLIC_AUTH_FRONTEND_URL || "https://logline-id.vercel.app"
    const appId = process.env.NEXT_PUBLIC_LOGLINE_APP_ID || "minicontratos"
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`)
    
    // Redirect to LogLine Auth Frontend
    window.location.href = `${authFrontendUrl}/auth?app_id=${appId}&redirect_uri=${redirectUri}`
  }, [])

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="mb-12">
        {/* Logo circle with green background and white 'm' */}
        <div className="w-32 h-32 rounded-full bg-[#00C853] flex items-start justify-center pt-2 mb-8 mx-auto">
          <span className="text-white font-bold text-6xl lowercase">m</span>
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight">
          <span className="text-white">MINI</span>
          <span className="text-[#00C853]">CONTRATOS</span>
        </h1>
        <p className="text-center text-gray-400 mt-4 text-lg">Registre. Consulte. Qualquer coisa.</p>
      </div>

      <div className="w-full max-w-md bg-[#1f1f1f] rounded-xl p-8 space-y-6 text-center">
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C853] mx-auto"></div>
          <h2 className="text-2xl font-semibold text-white">Redirecionando para LogLine Auth...</h2>
          <p className="text-gray-400 text-sm">
            Você será redirecionado para a página de autenticação do LogLine.
          </p>
        </div>
      </div>
    </div>
  )
}
