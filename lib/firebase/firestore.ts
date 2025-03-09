import { db } from "../firebase"
import { collection, doc, setDoc, getDoc, query, where, getDocs, orderBy, limit, updateDoc } from "firebase/firestore"
import type { ChatMessage } from "@/types/chat-message"
import type { MessageRecord } from "@/types/chat-messages-response"

// Função para salvar uma mensagem no Firestore
export async function saveMessageToFirestore(
  userId: string,
  instanceName: string,
  message: ChatMessage,
): Promise<boolean> {
  try {
    // Criar um ID único para a mensagem
    // Se temos recipientKeyHash e recipientTimestamp, usamos eles para garantir unicidade
    const messageId =
      message.recipientKeyHash && message.recipientTimestamp
        ? `${userId}_${instanceName}_${message.recipientKeyHash}_${message.recipientTimestamp}`
        : `${userId}_${instanceName}_${message.id}`

    // Referência ao documento da mensagem
    const messageRef = doc(db, "whatsapp_messages", messageId)

    // Dados da mensagem para salvar
    const messageData = {
      userId,
      instanceName,
      messageId: message.id,
      text: message.text,
      timestamp: message.timestamp,
      fromMe: message.fromMe,
      sender: message.sender,
      status: message.status,
      recipientKeyHash: message.recipientKeyHash || null,
      recipientTimestamp: message.recipientTimestamp || null,
      createdAt: new Date(),
      processed: true, // Marcar como processada
    }

    // Salvar a mensagem no Firestore
    await setDoc(messageRef, messageData, { merge: true })
    console.log(`Mensagem ${messageId} salva com sucesso no Firestore`)

    return true
  } catch (error) {
    console.error("Erro ao salvar mensagem no Firestore:", error)
    return false
  }
}

// Função para verificar se uma mensagem já existe no Firestore
export async function messageExistsInFirestore(
  userId: string,
  instanceName: string,
  message: ChatMessage,
): Promise<boolean> {
  try {
    // Se temos recipientKeyHash e recipientTimestamp, usamos eles para verificar
    if (message.recipientKeyHash && message.recipientTimestamp) {
      const messageId = `${userId}_${instanceName}_${message.recipientKeyHash}_${message.recipientTimestamp}`
      const messageRef = doc(db, "whatsapp_messages", messageId)
      const messageDoc = await getDoc(messageRef)
      return messageDoc.exists()
    }

    // Caso contrário, verificamos pelo ID da mensagem
    const messageId = `${userId}_${instanceName}_${message.id}`
    const messageRef = doc(db, "whatsapp_messages", messageId)
    const messageDoc = await getDoc(messageRef)
    return messageDoc.exists()
  } catch (error) {
    console.error("Erro ao verificar existência da mensagem:", error)
    return false
  }
}

// Função para buscar mensagens do Firestore
export async function fetchMessagesFromFirestore(
  userId: string,
  instanceName: string,
  contactJid: string,
): Promise<ChatMessage[]> {
  try {
    // Consulta para buscar mensagens do usuário, instância e contato específicos
    const messagesRef = collection(db, "whatsapp_messages")
    const q = query(
      messagesRef,
      where("userId", "==", userId),
      where("instanceName", "==", instanceName),
      where("sender", "==", contactJid),
      orderBy("timestamp", "asc"),
    )

    const querySnapshot = await getDocs(q)
    const messages: ChatMessage[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      messages.push({
        id: data.messageId,
        text: data.text,
        timestamp: data.timestamp,
        fromMe: data.fromMe,
        sender: data.sender,
        status: data.status,
        recipientKeyHash: data.recipientKeyHash,
        recipientTimestamp: data.recipientTimestamp,
        processed: data.processed,
      })
    })

    console.log(`Recuperadas ${messages.length} mensagens do Firestore para o contato ${contactJid}`)
    return messages
  } catch (error) {
    console.error("Erro ao buscar mensagens do Firestore:", error)
    return []
  }
}

// Função para buscar mensagens não processadas do Firestore
export async function fetchUnprocessedMessagesFromFirestore(
  userId: string,
  instanceName: string,
  contactJid: string,
): Promise<ChatMessage[]> {
  try {
    // Consulta para buscar mensagens não processadas
    const messagesRef = collection(db, "whatsapp_messages")
    const q = query(
      messagesRef,
      where("userId", "==", userId),
      where("instanceName", "==", instanceName),
      where("sender", "==", contactJid),
      where("processed", "==", false),
      orderBy("timestamp", "asc"),
    )

    const querySnapshot = await getDocs(q)
    const messages: ChatMessage[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      messages.push({
        id: data.messageId,
        text: data.text,
        timestamp: data.timestamp,
        fromMe: data.fromMe,
        sender: data.sender,
        status: data.status,
        recipientKeyHash: data.recipientKeyHash,
        recipientTimestamp: data.recipientTimestamp,
        processed: data.processed,
      })
    })

    return messages
  } catch (error) {
    console.error("Erro ao buscar mensagens não processadas:", error)
    return []
  }
}

// Função para obter o timestamp da mensagem mais recente no Firestore
export async function getLatestMessageTimestamp(
  userId: string,
  instanceName: string,
  contactJid: string,
): Promise<number | null> {
  try {
    const messagesRef = collection(db, "whatsapp_messages")
    const q = query(
      messagesRef,
      where("userId", "==", userId),
      where("instanceName", "==", instanceName),
      where("sender", "==", contactJid),
      orderBy("timestamp", "desc"),
      limit(1),
    )

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const latestMessage = querySnapshot.docs[0].data()
    return latestMessage.timestamp
  } catch (error) {
    console.error("Erro ao buscar timestamp da mensagem mais recente:", error)
    return null
  }
}

// Função para salvar mensagens de um contato no Firestore
export async function saveContactMessagesToFirestore(
  userId: string,
  instanceName: string,
  contactJid: string,
  messages: MessageRecord[],
): Promise<number> {
  try {
    let savedCount = 0

    for (const message of messages) {
      // Extrair o texto da mensagem
      const messageText = message.message.conversation || message.message.extendedTextMessage?.text || ""

      if (messageText) {
        // Extrair os metadados para identificação única
        const deviceListMetadata = message.message.deviceListMetadata || message.deviceListMetadata
        const recipientKeyHash = deviceListMetadata?.recipientKeyHash || null
        const recipientTimestamp = deviceListMetadata?.recipientTimestamp || null

        // Criar objeto ChatMessage
        const chatMessage: ChatMessage = {
          id: message.key.id,
          text: messageText,
          timestamp: message.messageTimestamp * 1000, // Converter para milissegundos
          fromMe: message.key.fromMe,
          sender: message.key.remoteJid,
          status:
            message.MessageUpdate && message.MessageUpdate.length > 0
              ? message.MessageUpdate[message.MessageUpdate.length - 1].status
              : "SENT",
          recipientKeyHash,
          recipientTimestamp,
        }

        // Salvar a mensagem no Firestore
        const saved = await saveMessageToFirestore(userId, instanceName, chatMessage)
        if (saved) {
          savedCount++
        }
      }
    }

    console.log(`Salvas ${savedCount} mensagens do contato ${contactJid} no Firestore`)
    return savedCount
  } catch (error) {
    console.error("Erro ao salvar mensagens do contato no Firestore:", error)
    return 0
  }
}

// Função para atualizar o timestamp da última mensagem de um contato
export async function updateContactLastMessageTimestamp(
  userId: string,
  instanceName: string,
  contactJid: string,
  timestamp: number,
): Promise<boolean> {
  try {
    // Normalizar o número do contato (remover o sufixo @s.whatsapp.net se existir)
    const normalizedNumber = contactJid.includes("@") ? contactJid.split("@")[0] : contactJid

    // Criar um ID único para o contato
    const contactId = `${userId}_${instanceName}_${normalizedNumber}`
    const contactRef = doc(db, "whatsapp_contacts", contactId)

    // Verificar se o contato existe
    const contactDoc = await getDoc(contactRef)

    if (!contactDoc.exists()) {
      console.warn(`Contato ${normalizedNumber} não encontrado para atualizar timestamp`)
      return false
    }

    // Atualizar apenas se o novo timestamp for mais recente
    const currentTimestamp = contactDoc.data().lastMessageTimestamp || 0
    if (timestamp > currentTimestamp) {
      await updateDoc(contactRef, {
        lastMessageTimestamp: timestamp,
        updatedAt: new Date(),
      })
      console.log(`Timestamp da última mensagem atualizado para ${normalizedNumber}: ${timestamp}`)
      return true
    }

    return false
  } catch (error) {
    console.error("Erro ao atualizar timestamp da última mensagem:", error)
    return false
  }
}

// Função para salvar o estado de sincronização de um contato
export async function saveContactSyncState(
  userId: string,
  instanceName: string,
  contactJid: string,
  lastSyncTimestamp: number,
): Promise<boolean> {
  try {
    // Criar um ID único para o estado de sincronização
    const syncStateId = `${userId}_${instanceName}_${contactJid}`

    // Referência ao documento do estado de sincronização
    const syncStateRef = doc(db, "whatsapp_sync_states", syncStateId)

    // Salvar o estado de sincronização
    await setDoc(
      syncStateRef,
      {
        userId,
        instanceName,
        contactJid,
        lastSyncTimestamp,
        updatedAt: new Date(),
      },
      { merge: true },
    )

    console.log(`Estado de sincronização salvo para ${contactJid}: ${lastSyncTimestamp}`)
    return true
  } catch (error) {
    console.error("Erro ao salvar estado de sincronização:", error)
    return false
  }
}

// Função para obter o estado de sincronização de um contato
export async function getContactSyncState(
  userId: string,
  instanceName: string,
  contactJid: string,
): Promise<number | null> {
  try {
    // Criar um ID único para o estado de sincronização
    const syncStateId = `${userId}_${instanceName}_${contactJid}`

    // Referência ao documento do estado de sincronização
    const syncStateRef = doc(db, "whatsapp_sync_states", syncStateId)

    // Buscar o estado de sincronização
    const syncStateDoc = await getDoc(syncStateRef)

    if (syncStateDoc.exists()) {
      const syncState = syncStateDoc.data()
      return syncState.lastSyncTimestamp
    }

    return null
  } catch (error) {
    console.error("Erro ao buscar estado de sincronização:", error)
    return null
  }
}

