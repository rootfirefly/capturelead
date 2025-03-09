"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/hooks/useAdmin"
import { useLoading } from "@/contexts/loading-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, isLoading } = useAdmin()
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    if (isLoading) {
      startLoading("Verificando permissões de administrador...")
    } else {
      stopLoading()
    }
  }, [isLoading, startLoading, stopLoading])

  if (isLoading) {
    return null
  }

  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso negado</AlertTitle>
        <AlertDescription>
          Você não tem permissão para acessar esta página. Entre em contato com o administrador do sistema.
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}

