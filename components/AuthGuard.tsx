"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useLoading } from "@/contexts/loading-context"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    console.log("AuthGuard: Estado de autenticação:", loading ? "carregando" : user ? "autenticado" : "não autenticado")

    if (loading) {
      startLoading("Verificando autenticação...")
    } else {
      stopLoading()

      if (!user) {
        console.log("AuthGuard: Redirecionando para login")
        router.push("/login")
      }
    }
  }, [user, loading, router, startLoading, stopLoading])

  if (loading || !user) {
    return null
  }

  return <>{children}</>
}

