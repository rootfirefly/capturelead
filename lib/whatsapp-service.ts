import type { WhatsAppInstanceDetailed } from "@/types/whatsapp-instance"

export async function fetchAllInstances(apiUrl: string, apiKey: string): Promise<WhatsAppInstanceDetailed[]> {
  try {
    const response = await fetch(`${apiUrl}/instance/fetchInstances`, {
      method: "GET",
      headers: {
        apikey: apiKey,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar instâncias: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Verifica o formato da resposta e normaliza para o formato detalhado
    if (Array.isArray(data)) {
      // Se já for um array, verifica se é o formato detalhado ou básico
      if (data.length > 0 && "id" in data[0]) {
        // Já está no formato detalhado
        return data as WhatsAppInstanceDetailed[]
      } else if (data.length > 0 && "instance" in data[0]) {
        // Formato básico, converte para detalhado
        return data.map((item: any) => ({
          id: item.instance.instanceId,
          name: item.instance.instanceName,
          connectionStatus: item.instance.status,
          ownerJid: item.instance.owner || null,
          profileName: item.instance.profileName || null,
          profilePicUrl: item.instance.profilePictureUrl || null,
          integration: item.instance.integration.integration || "UNKNOWN",
          token: item.instance.apikey,
          clientName: "evolution",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })) as WhatsAppInstanceDetailed[]
      }
    }

    // Formato desconhecido, retorna array vazio
    console.error("Formato de resposta desconhecido:", data)
    return []
  } catch (error) {
    console.error("Erro ao buscar instâncias:", error)
    throw error
  }
}

// Interface para as configurações da instância usando camelCase conforme a API
export interface InstanceSettings {
  rejectCall: boolean
  msgCall?: string
  groupsIgnore: boolean
  alwaysOnline: boolean
  readMessages: boolean
  readStatus: boolean
  syncFullHistory: boolean
}

// Função para buscar as configurações de uma instância
export async function fetchInstanceSettings(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
): Promise<InstanceSettings | null> {
  try {
    const encodedInstanceName = encodeURIComponent(instanceName)
    const response = await fetch(`${apiUrl}/settings/find/${encodedInstanceName}`, {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar configurações: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Configurações recebidas:", data)

    if (data && data.settings && data.settings.settings) {
      return data.settings.settings as InstanceSettings
    }

    return null
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    return null
  }
}

// Função para atualizar as configurações de uma instância
export async function updateInstanceSettings(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  settings: InstanceSettings,
): Promise<any> {
  try {
    console.log("Enviando configurações para a API:", JSON.stringify(settings))

    // Garantir que o nome da instância esteja codificado corretamente na URL
    const encodedInstanceName = encodeURIComponent(instanceName)

    // Verificar se a instância existe antes de atualizar as configurações
    const checkResponse = await fetch(`${apiUrl}/instance/connectionState/${encodedInstanceName}`, {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    })

    if (!checkResponse.ok) {
      throw new Error(`Instância não encontrada: ${checkResponse.status} ${checkResponse.statusText}`)
    }

    // Usar o endpoint correto e o formato correto para as configurações
    const response = await fetch(`${apiUrl}/settings/set/${encodedInstanceName}`, {
      method: "POST",
      headers: {
        apikey: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Usar camelCase conforme esperado pela API
        rejectCall: settings.rejectCall,
        msgCall: settings.msgCall || "",
        groupsIgnore: settings.groupsIgnore,
        alwaysOnline: settings.alwaysOnline,
        readMessages: settings.readMessages,
        readStatus: settings.readStatus,
        syncFullHistory: settings.syncFullHistory,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao atualizar configurações: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Resposta da API após atualização:", data)
    return data
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    throw error
  }
}

