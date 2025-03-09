export interface WhatsAppContact {
  id: string
  name: string
  number: string
  profilePictureUrl?: string
  updatedAt?: string
  lastMessageTimestamp?: number // Timestamp da última mensagem (em milissegundos)
}

