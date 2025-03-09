"use client"

import { useState, useEffect } from "react"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useApiConfig } from "@/hooks/useApiConfig"
import { toast } from "@/components/ui/use-toast"

interface WhatsAppInstance {
  id: string
  instanceName: string
  status: string
  userId: string
  createdAt: Date
}

export function useActiveWhatsAppInstances() {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { config } = useApiConfig()

  useEffect(() => {
    const fetchActiveInstances = async () => {
      const user = auth.currentUser
      if (!user) return

      setIsLoading(true)
      setError(null)

      try {
        // Buscar apenas instâncias com status "CONNECTED" ou "open"
        const q = query(
          collection(db, "whatsapp_instances"),
          where("userId", "==", user.uid),
          where("status", "in", ["CONNECTED", "open", "OPEN", "Open"]),
        )

        const querySnapshot = await getDocs(q)
        const activeInstances: WhatsAppInstance[] = []

        querySnapshot.forEach((doc) => {
          activeInstances.push({ id: doc.id, ...doc.data() } as WhatsAppInstance)
        })

        setInstances(activeInstances)
      } catch (err) {
        console.error("Erro ao buscar instâncias ativas:", err)
        setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar instâncias ativas"))
        toast({
          title: "Erro ao carregar instâncias",
          description: "Não foi possível carregar as instâncias ativas do WhatsApp.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveInstances()
  }, [])

  return {
    instances,
    isLoading,
    error,
  }
}

