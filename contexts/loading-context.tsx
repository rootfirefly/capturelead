"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Preloader } from "@/components/ui/preloader"

interface LoadingContextType {
  isLoading: boolean
  startLoading: (message?: string) => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined)

  const startLoading = (message?: string) => {
    console.log("LoadingContext: Iniciando carregamento", message)
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const stopLoading = () => {
    console.log("LoadingContext: Parando carregamento")
    setIsLoading(false)
    setLoadingMessage(undefined)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && <Preloader fullScreen size="lg" text={loadingMessage} />}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

