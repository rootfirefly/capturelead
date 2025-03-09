export interface MessageRecord {
  id?: string
  key: {
    id: string
    fromMe: boolean
    remoteJid: string
  }
  pushName?: string
  messageType?: string
  message: {
    conversation?: string
    extendedTextMessage?: {
      text: string
    }
  }
  messageTimestamp: number
  instanceId?: string
  source?: string
  contextInfo?: any
  MessageUpdate?: Array<{
    status: string
  }>
}

export interface ChatMessagesResponse {
  messages: {
    total: number
    pages: number
    currentPage: number
    records: MessageRecord[]
  }
}

