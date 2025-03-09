import type { WhatsAppContact } from "@/types/whatsapp-contact"
import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore"

// Modificar a função fetchContactsWithLatestMessages para usar a API de mensagens
export async function fetchContactsWithLatestMessages(
  apiUrl: string,
  apiKey: string,
  instanceName: string,
  userId: string,
): Promise<WhatsAppContact[]> {
  try {
    console.log(`Buscando contatos com mensagens recentes para a instância ${instanceName}...`)

    // Importar a função para buscar mensagens recentes
    const { fetchRecentMessagesForAllContacts } = await import("@/lib/whatsapp-message-service")

    // 1. Buscar as mensagens mais recentes de todos os contatos
    const recentMessages = await fetchRecentMessagesForAllContacts(apiUrl, apiKey, instanceName)

    if (!recentMessages || recentMessages.length === 0) {
      console.warn("Nenhuma mensagem recente encontrada")
      return []
    }

    // 2. Extrair contatos únicos das mensagens recentes
    const contactsMap = new Map<string, WhatsAppContact>()

    for (const message of recentMessages) {
      try {
        if (!message.key || !message.key.remoteJid) {
          console.warn("Mensagem sem remoteJid, pulando...")
          continue
        }

        const remoteJid = message.key.remoteJid

        // Ignorar grupos (contém @g.us) e status
        if (remoteJid.includes("@g.us") || remoteJid === "status@s.whatsapp.net" || remoteJid === "status@broadcast") {
          continue
        }

        // Extrair número e nome
        const number = remoteJid.split("@")[0]
        const name = message.pushName || number

        // Se já temos este contato, atualizar apenas se a mensagem for mais recente
        if (contactsMap.has(remoteJid)) {
          const existingContact = contactsMap.get(remoteJid)!
          if (message.messageTimestamp > (existingContact.lastMessageTimestamp || 0) / 1000) {
            existingContact.lastMessageTimestamp = message.messageTimestamp * 1000
            // Atualizar o nome se o existente for apenas o número
            if (existingContact.name === existingContact.number && message.pushName) {
              existingContact.name = message.pushName
            }
          }
        } else {
          // Criar novo contato
          contactsMap.set(remoteJid, {
            id: remoteJid,
            name: name,
            number: number,
            lastMessageTimestamp: message.messageTimestamp * 1000, // Converter para milissegundos
          })
        }
      } catch (messageError) {
        console.error("Erro ao processar mensagem para extração de contato:", messageError)
        // Continuar com a próxima mensagem
      }
    }

    // 3. Converter o Map para array
    const contacts = Array.from(contactsMap.values())

    // 4. Ordenar contatos pelo timestamp da última mensagem (mais recente primeiro)
    contacts.sort((a, b) => {
      const timestampA = a.lastMessageTimestamp || 0
      const timestampB = b.lastMessageTimestamp || 0
      return timestampB - timestampA
    })

    console.log(`${contacts.length} contatos extraídos e ordenados por mensagens recentes`)

    // 5. Salvar contatos no Firestore
    try {
      await saveContactsToFirestore(userId, instanceName, contacts)
    } catch (saveError) {
      console.error("Erro ao salvar contatos no Firestore:", saveError)
      // Continuar mesmo se falhar ao salvar no Firestore
    }

    return contacts
  } catch (error) {
    console.error("Erro ao buscar contatos com mensagens recentes:", error)
    return []
  }
}

// Função para salvar contatos no Firestore
export async function saveContactsToFirestore(
  userId: string,
  instanceName: string,
  contacts: WhatsAppContact[],
): Promise<boolean> {
  try {
    console.log(`Salvando ${contacts.length} contatos no Firestore para a instância ${instanceName}...`)

    for (const contact of contacts) {
      try {
        // Criar um ID único para o contato
        const contactId = contact.id.replace(/[@:.]/g, "_")

        // Referência ao documento do contato
        const contactRef = doc(db, "whatsapp_contacts", `${userId}_${instanceName}_${contactId}`)

        // Verificar se o contato já existe
        const contactDoc = await getDoc(contactRef)

        // Na função saveContactsToFirestore, modifique a parte onde cria ou atualiza o documento

        // Quando atualiza um contato existente, remova profilePictureUrl se for undefined
        if (contactDoc.exists()) {
          // Se o contato já existe, atualizar apenas os campos necessários
          // Preservar o lastMessageTimestamp se já existir e for mais recente
          const existingData = contactDoc.data()
          const existingTimestamp = existingData.lastMessageTimestamp || 0
          const newTimestamp = contact.lastMessageTimestamp || 0

          const updateData: any = {
            name: contact.name,
            number: contact.number,
            lastMessageTimestamp: Math.max(existingTimestamp, newTimestamp),
            updatedAt: serverTimestamp(),
          }

          // Adicionar profilePictureUrl apenas se não for undefined
          if (contact.profilePictureUrl !== undefined) {
            updateData.profilePictureUrl = contact.profilePictureUrl
          }

          await updateDoc(contactRef, updateData)
        } else {
          // Se o contato não existe, criar um novo documento
          const newContactData: any = {
            userId,
            instanceName,
            id: contact.id,
            name: contact.name,
            number: contact.number,
            lastMessageTimestamp: contact.lastMessageTimestamp || 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }

          // Adicionar profilePictureUrl apenas se não for undefined
          if (contact.profilePictureUrl !== undefined) {
            newContactData.profilePictureUrl = contact.profilePictureUrl
          }

          await setDoc(contactRef, newContactData)
        }
      } catch (error) {
        console.error(`Erro ao salvar contato ${contact.id}:`, error)
      }
    }

    console.log(`Contatos salvos com sucesso no Firestore`)
    return true
  } catch (error) {
    console.error("Erro ao salvar contatos no Firestore:", error)
    return false
  }
}

// Função para buscar contatos do Firestore
export async function getContactsFromFirestore(userId: string, instanceName: string): Promise<WhatsAppContact[]> {
  try {
    console.log(`Buscando contatos do Firestore para a instância ${instanceName}...`)

    // Consulta para buscar contatos do usuário e instância específicos
    const contactsRef = collection(db, "whatsapp_contacts")
    const q = query(
      contactsRef,
      where("userId", "==", userId),
      where("instanceName", "==", instanceName),
      orderBy("lastMessageTimestamp", "desc"), // Ordenar pelo timestamp da última mensagem (decrescente)
    )

    const querySnapshot = await getDocs(q)
    const contacts: WhatsAppContact[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      contacts.push({
        id: data.id,
        name: data.name,
        number: data.number,
        profilePictureUrl: data.profilePictureUrl,
        lastMessageTimestamp: data.lastMessageTimestamp,
      })
    })

    // Filtrar contatos especiais do sistema
    const filteredContacts = contacts.filter(
      (contact) => !contact.id.includes("status@broadcast") && !contact.id.includes("status@s.whatsapp.net"),
    )

    console.log(`${contacts.length} contatos encontrados no Firestore, ${filteredContacts.length} após filtragem`)
    return filteredContacts
  } catch (error) {
    console.error("Erro ao buscar contatos do Firestore:", error)
    return []
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
    // Normalizar o ID do contato
    const contactId = contactJid.replace(/[@:.]/g, "_")

    // Referência ao documento do contato
    const contactRef = doc(db, "whatsapp_contacts", `${userId}_${instanceName}_${contactId}`)

    // Verificar se o contato existe
    const contactDoc = await getDoc(contactRef)

    if (!contactDoc.exists()) {
      console.warn(`Contato ${contactJid} não encontrado para atualizar timestamp`)
      return false
    }

    // Atualizar apenas se o novo timestamp for mais recente
    const currentTimestamp = contactDoc.data().lastMessageTimestamp || 0
    if (timestamp > currentTimestamp) {
      await updateDoc(contactRef, {
        lastMessageTimestamp: timestamp,
        updatedAt: serverTimestamp(),
      })
      console.log(`Timestamp da última mensagem atualizado para ${contactJid}: ${timestamp}`)
      return true
    }

    return false
  } catch (error) {
    console.error("Erro ao atualizar timestamp da última mensagem:", error)
    return false
  }
}

