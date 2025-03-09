// Tipo para o primeiro formato de resposta da API
export interface WhatsAppInstanceBasic {
  instance: {
    instanceName: string
    instanceId: string
    owner?: string
    profileName?: string
    profilePictureUrl?: string | null
    profileStatus?: string
    status: string
    serverUrl: string
    apikey: string
    integration: {
      integration?: string
      token?: string
      webhook_wa_business?: string
    }
  }
}

// Tipo para o segundo formato de resposta da API (mais detalhado)
export interface WhatsAppInstanceDetailed {
  id: string
  name: string
  connectionStatus: string
  ownerJid?: string
  profileName?: string
  profilePicUrl?: string | null
  integration: string
  number?: string | null
  businessId?: string | null
  token: string
  clientName: string
  disconnectionReasonCode?: string | null
  disconnectionObject?: any | null
  disconnectionAt?: string | null
  createdAt: string
  updatedAt: string
  Setting?: {
    id: string
    rejectCall: boolean
    msgCall: string
    groupsIgnore: boolean
    alwaysOnline: boolean
    readMessages: boolean
    readStatus: boolean
    syncFullHistory: boolean
    wavoipToken: string | null
    createdAt: string
    updatedAt: string
    instanceId: string
  }
  _count?: {
    Message: number
    Contact: number
    Chat: number
  }
  Chatwoot?: any | null
  Proxy?: any | null
  Rabbitmq?: any | null
  Sqs?: any | null
  Websocket?: any | null
}

// Tipo unificado para trabalhar com ambos os formatos
export type WhatsAppInstance = WhatsAppInstanceBasic | WhatsAppInstanceDetailed

// Função para verificar se é o formato detalhado
export function isDetailedInstance(instance: WhatsAppInstance): instance is WhatsAppInstanceDetailed {
  return "id" in instance && "name" in instance
}

