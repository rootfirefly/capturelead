"use client"

import { useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchAllInstances } from "@/lib/whatsapp-service"
import { useApiConfig } from "@/hooks/useApiConfig"
import type { WhatsAppInstanceDetailed } from "@/types/whatsapp-instance"

// Chave para o cache de instâncias do WhatsApp
const WHATSAPP_INSTANCES_CACHE_KEY = "whatsapp-instances"

export function useWhatsAppInstances() {
  const { config, isLoading: isLoadingConfig } = useApiConfig()
  const queryClient = useQueryClient()

  // Função para buscar instâncias
  const fetchInstances = useCallback(async () => {
    if (!config) throw new Error("Configuração da API não disponível")
    return fetchAllInstances(config.evolutionApiUrl, config.evolutionApiKey)
  }, [config])

  // Configuração do React Query com cache otimizado
  const {
    data: instances = [],
    isLoading,
    error,
  } = useQuery<WhatsAppInstanceDetailed[]>({
    queryKey: [WHATSAPP_INSTANCES_CACHE_KEY],
    queryFn: fetchInstances,
    // Manter os dados "frescos" por 5 minutos antes de considerar recarregamento
    staleTime: 5 * 60 * 1000,
    // Manter os dados em cache por 30 minutos mesmo quando não estão sendo usados
    gcTime: 30 * 60 * 1000,
    // Não executar a query se a configuração ainda estiver carregando
    enabled: !isLoadingConfig && !!config,
    // Manter os dados antigos enquanto recarrega
    keepPreviousData: true,
  })

  // Função para forçar uma atualização dos dados
  const refetch = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: [WHATSAPP_INSTANCES_CACHE_KEY] })
  }, [queryClient])

  // Função para atualizar o cache após uma modificação em uma instância específica
  const updateInstanceInCache = useCallback(
    (updatedInstance: WhatsAppInstanceDetailed) => {
      queryClient.setQueryData<WhatsAppInstanceDetailed[]>([WHATSAPP_INSTANCES_CACHE_KEY], (oldData) => {
        if (!oldData) return [updatedInstance]
        return oldData.map((instance) => (instance.id === updatedInstance.id ? updatedInstance : instance))
      })
    },
    [queryClient],
  )

  return {
    instances,
    isLoading: isLoading || isLoadingConfig,
    error,
    refetch,
    updateInstanceInCache,
  }
}

