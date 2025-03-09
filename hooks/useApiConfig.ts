"use client"

import { useState, useEffect } from "react"
import { getApiConfig } from "@/lib/api-config"
import type { ApiConfig } from "@/types/api-config"

export function useApiConfig() {
  const [config, setConfig] = useState<ApiConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchConfig() {
      try {
        setIsLoading(true)
        const apiConfig = await getApiConfig()
        setConfig(apiConfig)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar configurações da API"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return { config, isLoading, error }
}

