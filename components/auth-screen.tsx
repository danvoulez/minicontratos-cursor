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

  if (magicLinkSent) {
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
        </div>

        <div className="w-full max-w-md bg-[#1f1f1f] rounded-xl p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Check your email</h2>
            <p className="text-gray-400 text-sm">
              We sent a magic link to <strong>{email}</strong>
              <br />
              Click the link to sign in.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              setMagicLinkSent(false)
              setEmail("")
            }}
            className="text-gray-400 hover:text-white"
          >
            Try another email
          </Button>
        </div>
      </div>
    )
  }

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
            {isLoading ? "Enviando..." : "Continue with Email"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#2a2a2a]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1f1f1f] px-2 text-gray-500">Ou</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full h-12 bg-[#0a0a0a] border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:text-white"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-xs text-gray-500 mt-6">We trust and build with LogLine.</p>
      </div>
    </div>
  )
}
