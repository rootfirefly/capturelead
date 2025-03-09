import { db } from "./firebase"
import { collection, doc, getDocs, setDoc, query, limit } from "firebase/firestore"
import type { ApiConfig } from "@/types/api-config"

// Coleção no Firestore
const API_CONFIG_COLLECTION = "api_configurations"

// Valores padrão
const DEFAULT_API_CONFIG: ApiConfig = {
  evolutionApiUrl: "https://api.nexuinsolution.com.br",
  evolutionApiKey: "54097daa7c0367324c0f643f74ce190f",
}

// Obter a configuração atual da API
export async function getApiConfig(): Promise<ApiConfig> {
  try {
    // Tenta buscar a configuração mais recente
    const q = query(collection(db, API_CONFIG_COLLECTION), limit(1))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const configDoc = querySnapshot.docs[0]
      return { id: configDoc.id, ...configDoc.data() } as ApiConfig
    }

    // Se não encontrar nenhuma configuração, retorna os valores padrão
    return DEFAULT_API_CONFIG
  } catch (error) {
    console.error("Erro ao buscar configuração da API:", error)
    return DEFAULT_API_CONFIG
  }
}

// Salvar nova configuração da API
export async function saveApiConfig(config: ApiConfig, userId: string): Promise<string> {
  try {
    const now = new Date()
    const configData = {
      ...config,
      updatedAt: now,
      createdAt: config.id ? config.createdAt : now,
      createdBy: config.id ? config.createdBy : userId,
    }

    // Se já existe um ID, atualiza o documento existente
    if (config.id) {
      await setDoc(doc(db, API_CONFIG_COLLECTION, config.id), configData, { merge: true })
      return config.id
    }

    // Caso contrário, cria um novo documento
    const newDocRef = doc(collection(db, API_CONFIG_COLLECTION))
    await setDoc(newDocRef, configData)
    return newDocRef.id
  } catch (error) {
    console.error("Erro ao salvar configuração da API:", error)
    throw error
  }
}

