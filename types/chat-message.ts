export interface ChatMessage {
  id: string
  text: string
  timestamp: number
  fromMe: boolean
  sender: string
  status?: string
  // Adicionando metadados para identificação única
  recipientKeyHash?: string | null
  recipientTimestamp?: string | null
  // Campo para controle interno
  processed?: boolean
}

