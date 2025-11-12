"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function AuthCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyAndLogin } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      verifyAndLogin(token)
        .then(() => {
          router.push("/")
        })
        .catch((error) => {
          console.error("Auth error:", error)
          router.push("/?error=auth_failed")
        })
    } else {
      router.push("/?error=no_token")
    }
  }, [searchParams, router, verifyAndLogin])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[#00C853] flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-3xl lowercase">m</span>
        </div>
        <p className="text-white">Authenticating...</p>
      </div>
    </div>
  )
}
