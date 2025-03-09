"use client"

import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { WhatsAppInstanceCreator } from "@/components/WhatsAppInstanceCreator"
import { WhatsAppInstanceList } from "@/components/WhatsAppInstanceList"
import { useLoading } from "@/contexts/loading-context"

interface WhatsAppInstance {
  id: string
  instanceName: string
  status: string
  userId: string
  createdAt: Date
}

export default function WhatsAppRegistration() {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([])
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    fetchInstances()
  }, [])

  const fetchInstances = async () => {
    const user = auth.currentUser
    if (!user) return

    startLoading("Carregando instâncias do WhatsApp...")

    try {
      const q = query(collection(db, "whatsapp_instances"), where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)
      const fetchedInstances: WhatsAppInstance[] = []
      querySnapshot.forEach((doc) => {
        fetchedInstances.push({ id: doc.id, ...doc.data() } as WhatsAppInstance)
      })
      setInstances(fetchedInstances)
    } catch (error) {
      console.error("Erro ao carregar instâncias:", error)
      toast({
        title: "Erro ao carregar instâncias",
        description: "Não foi possível carregar as instâncias do WhatsApp.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  const handleInstanceCreated = async (instanceName: string, instanceId: string) => {
    const newInstance = {
      id: instanceId,
      instanceName,
      status: "created",
      userId: auth.currentUser?.uid || "",
      createdAt: new Date(),
    }
    setInstances([...instances, newInstance])
    toast({
      title: "Instância criada com sucesso",
      description: `A instância ${instanceName} foi criada e salva.`,
    })
  }

  const handleInstanceDeleted = async (instanceId: string, instanceName: string) => {
    startLoading("Excluindo instância...")

    try {
      await deleteDoc(doc(db, "whatsapp_instances", instanceId))
      setInstances(instances.filter((instance) => instance.id !== instanceId))
      toast({
        title: "Instância excluída com sucesso",
        description: `A instância ${instanceName} foi excluída.`,
      })
    } catch (error) {
      console.error("Erro ao excluir a instância:", error)
      toast({
        title: "Erro ao excluir a instância",
        description: "Ocorreu um erro ao excluir a instância do banco de dados.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Instâncias WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <WhatsAppInstanceCreator onInstanceCreated={handleInstanceCreated} />
          <WhatsAppInstanceList instances={instances} onInstanceDeleted={handleInstanceDeleted} />
        </CardContent>
      </Card>
    </div>
  )
}

