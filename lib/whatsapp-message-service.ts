import type { ChatMessage } from "@/types/chat-message"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

// Atualizar a função fetchContactMessages para buscar mensagens de um contato específico
export async function fetchContactMessages(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  contactJid: string,
  page = 1,
  limit = 50,
): Promise<ChatMessage[]> {
  try {
    console.log(`Buscando mensagens para o contato ${contactJid}, página ${page}`)

    const response = await fetch(`${apiUrl}/chat/findMessages/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        where: {
          key: {
            remoteJid: contactJid,
          },
        },
        limit: limit,
        page: page,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar mensagens: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Resposta da API para mensagens de ${contactJid}:`, data)

    if (!data || !data.messages || !data.messages.records) {
      console.warn(`Nenhuma mensagem encontrada para ${contactJid}`)
      return []
    }

    const messages: ChatMessage[] = []

    // Processar cada registro de mensagem
    for (const record of data.messages.records) {
      try {
        // Extrair o texto da mensagem
        const messageText = record.message?.conversation || record.message?.extendedTextMessage?.text || ""

        if (messageText) {
          messages.push({
            id: record.key.id,
            text: messageText,
            timestamp: record.messageTimestamp * 1000, // Converter para milissegundos
            fromMe: record.key.fromMe,
            sender: record.key.remoteJid,
            status:
              record.MessageUpdate && record.MessageUpdate.length > 0
                ? record.MessageUpdate[record.MessageUpdate.length - 1].status
                : record.key.fromMe
                  ? "SENT"
                  : "RECEIVED",
          })
        }
      } catch (recordError) {
        console.error("Erro ao processar registro de mensagem:", recordError)
        // Continuar com o próximo registro
      }
    }

    // Ordenar mensagens por timestamp (mais antigas primeiro)
    messages.sort((a, b) => a.timestamp - b.timestamp)

    console.log(`${messages.length} mensagens processadas para ${contactJid}`)
    return messages
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return []
  }
}

// Atualizar a função sendTextMessage para usar o formato correto da API
export async function sendTextMessage(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  messageData: { number: string; text: string },
): Promise<any> {
  try {
    console.log(`Enviando mensagem para ${messageData.number}: "${messageData.text}"`)

    const response = await fetch(`${apiUrl}/message/sendText/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: messageData.number,
        text: messageData.text,
        delay: 120,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Resposta do envio de mensagem:", data)
    return data
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    throw error
  }
}

// Function to save a message to Firestore
export async function saveMessageToFirestore(
  userId: string,
  instanceName: string,
  message: ChatMessage,
): Promise<boolean> {
  try {
    const messageId = `${userId}_${instanceName}_${message.id}`
    const messageRef = doc(db, "whatsapp_messages", messageId)

    const messageData = {
      userId,
      instanceName,
      messageId: message.id,
      text: message.text,
      timestamp: message.timestamp,
      fromMe: message.fromMe,
      sender: message.sender,
      status: message.status,
      createdAt: new Date(),
    }

    await setDoc(messageRef, messageData, { merge: true })
    console.log(`Mensagem ${messageId} salva com sucesso no Firestore`)
    return true
  } catch (error) {
    console.error("Erro ao salvar mensagem no Firestore:", error)
    return false
  }
}

// Function to check if a number is a valid WhatsApp number
export async function checkIsWhatsApp(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  number: string,
): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/chat/whatsappNumbers/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        numbers: [number],
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao verificar número: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    if (data && data.valid && Array.isArray(data.valid) && data.valid.length > 0) {
      return data.valid.includes(number)
    }

    return false
  } catch (error) {
    console.error("Erro ao verificar número:", error)
    return false
  }
}

// Function to fetch profile picture URL
export async function fetchProfilePictureUrl(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  number: string,
): Promise<string | null> {
  try {
    const response = await fetch(`${apiUrl}/contact/getProfilePicture/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({ number }),
    })

    if (!response.ok) {
      console.warn("Erro ao buscar foto de perfil:", response.status, response.statusText)
      return null
    }

    const data = await response.json()
    return data.profilePicUrl || null
  } catch (error) {
    console.error("Erro ao buscar foto de perfil:", error)
    return null
  }
}

// Polling function (dummy implementation)
export function startMessagePolling(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  userId: string,
  contactJid: string,
  onNewMessages: (messages: ChatMessage[]) => void,
  existingMessages: ChatMessage[],
  intervalMs = 5000,
): { stop: () => void } {
  let isRunning = true
  let lastTimestamp = Date.now() // Initialize lastTimestamp

  const pollMessages = async () => {
    if (!isRunning) return

    try {
      // Dummy implementation: just adds a new message every interval
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Nova mensagem (polling)",
        timestamp: Date.now(),
        fromMe: false,
        sender: contactJid,
        status: "RECEIVED",
      }

      const newMessages = [newMessage]

      if (newMessages.length > 0) {
        console.log(`${newMessages.length} novas mensagens encontradas durante polling`)

        // Atualizar o último timestamp conhecido
        lastTimestamp = Math.max(...newMessages.map((msg) => msg.timestamp), lastTimestamp)

        // Notificar sobre as novas mensagens de forma segura
        try {
          // Usar setTimeout para garantir que a atualização não ocorra durante a renderização
          setTimeout(() => {
            onNewMessages(newMessages)
          }, 0)
        } catch (callbackError) {
          console.error("Erro ao chamar callback de novas mensagens:", callbackError)
        }
      }
    } catch (error) {
      console.error("Erro durante polling de mensagens:", error)
    }

    if (isRunning) {
      setTimeout(pollMessages, intervalMs)
    }
  }

  pollMessages()

  return {
    stop: () => {
      isRunning = false
      console.log("Polling de mensagens interrompido")
    },
  }
}

// Dummy implementation for isMessageInList
export function isMessageInList(message: ChatMessage, messageList: ChatMessage[]): boolean {
  return messageList.some((msg) => msg.id === message.id)
}

// Dummy implementation for updateContactLastMessageTimestamp
export async function updateContactLastMessageTimestamp(
  userId: string,
  instanceName: string,
  contactJid: string,
  timestamp: number,
): Promise<boolean> {
  console.log(`Atualizando timestamp da última mensagem para ${contactJid}: ${timestamp}`)
  return true
}

// Dummy implementation for fetchMessagesFromFirestore
export async function fetchMessagesFromFirestore(
  userId: string,
  instanceName: string,
  contactJid: string,
): Promise<ChatMessage[]> {
  console.log(`Buscando mensagens do Firestore para ${contactJid}`)
  return []
}

// Dummy implementation for syncContactMessages
export async function syncContactMessages(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  userId: string,
  contactJid: string,
  forceSync = false,
): Promise<{ success: number; total: number; failed: number }> {
  console.log(`Sincronizando mensagens para ${contactJid}`)
  return { success: 0, total: 0, failed: 0 }
}

// Dummy implementation for syncAllContactMessages
export async function syncAllContactMessages(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  userId: string,
  contacts: any[],
): Promise<{ success: number; total: number; failed: number }> {
  console.log(`Sincronizando mensagens para todos os contatos`)
  return { success: 0, total: 0, failed: 0 }
}

// Dummy implementation for fetchContacts
export async function fetchContacts(apiUrl: string, apiKey: string, instanceName: string): Promise<any[]> {
  console.log(`Buscando contatos para ${instanceName}`)
  return []
}

// Adicionar função para buscar as mensagens mais recentes de todos os contatos
export async function fetchRecentMessagesForAllContacts(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
): Promise<any[]> {
  try {
    console.log(`Buscando mensagens recentes para todos os contatos`)

    const response = await fetch(`${apiUrl}/chat/findMessages/${instanceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        where: {},
        limit: 100, // Buscar as 100 mensagens mais recentes
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar mensagens recentes: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data || !data.messages || !data.messages.records) {
      console.warn("Nenhuma mensagem recente encontrada")
      return []
    }

    console.log(`${data.messages.records.length} mensagens recentes encontradas`)
    return data.messages.records
  } catch (error) {
    console.error("Erro ao buscar mensagens recentes:", error)
    return []
  }
}

export type { ChatMessage }

