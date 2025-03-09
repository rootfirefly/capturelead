"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Trash2, LogOut, RefreshCw, Link, Activity } from "lucide-react"
import { QRCodeModal } from "./QRCodeModal"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { useApiConfig } from "@/hooks/useApiConfig"

interface WhatsAppInstance {
  id: string
  instanceName: string
  status: string
}

interface WhatsAppInstanceListProps {
  instances: WhatsAppInstance[]
  onInstanceDeleted: (instanceId: string, instanceName: string) => void
}

export function WhatsAppInstanceList({ instances, onInstanceDeleted }: WhatsAppInstanceListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false)
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null)
  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, string>>({})
  const { config, isLoading: isLoadingConfig } = useApiConfig()

  const setLoading = (instanceId: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [instanceId]: isLoading }))
  }

  useEffect(() => {
    if (isLoadingConfig || !config) return

    const intervalId = setInterval(() => {
      instances.forEach((instance) => {
        handleCheckStatus(instance.id, instance.instanceName)
      })
    }, 30000) // Check status every 30 seconds

    return () => clearInterval(intervalId)
  }, [instances, config, isLoadingConfig])

  const handleDelete = async (instanceId: string, instanceName: string) => {
    if (isLoadingConfig || !config) {
      toast({
        title: "Configurações não carregadas",
        description: "Aguarde o carregamento das configurações da API.",
        variant: "destructive",
      })
      return
    }

    setLoading(instanceId, true)
    try {
      const response = await fetch(`${config.evolutionApiUrl}/instance/delete/${instanceName}`, {
        method: "DELETE",
        headers: {
          apikey: config.evolutionApiKey,
        },
      })
      const data = await response.json()
      console.log("Delete instance response:", data)
      onInstanceDeleted(instanceId, instanceName)
    } catch (error) {
      console.error("Erro ao excluir instância:", error)
      toast({
        title: "Erro ao excluir instância",
        description: "Ocorreu um erro ao excluir a instância. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(instanceId, false)
    }
  }

  const handleLogout = async (instanceName: string) => {
    if (isLoadingConfig || !config) return

    try {
      const response = await fetch(`${config.evolutionApiUrl}/instance/logout/${instanceName}`, {
        method: "DELETE",
        headers: {
          apikey: config.evolutionApiKey,
        },
      })
      const data = await response.json()
      console.log("Logout instance response:", data)
      toast({
        title: "Logout realizado",
        description: `Logout da instância ${instanceName} realizado com sucesso.`,
      })
      handleCheckStatus(instanceName)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao fazer logout da instância. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCheckStatus = async (instanceId: string, instanceName: string) => {
    if (isLoadingConfig || !config) return

    try {
      const response = await fetch(`${config.evolutionApiUrl}/instance/connectionState/${instanceName}`, {
        method: "GET",
        headers: {
          apikey: config.evolutionApiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Check status response:", data)

      if (!data || !data.instance || !data.instance.state) {
        throw new Error("Invalid response structure")
      }

      const newStatus = data.instance.state
      setInstanceStatuses((prev) => ({ ...prev, [instanceName]: newStatus }))

      // Update status in Firestore
      const instanceRef = doc(db, "whatsapp_instances", instanceId)
      await updateDoc(instanceRef, { status: newStatus })
    } catch (error) {
      console.error("Erro ao verificar status:", error)
      setInstanceStatuses((prev) => ({ ...prev, [instanceName]: "Erro" }))

      // Log more detailed error information
      if (error instanceof Error) {
        console.error("Error details:", error.message)
      }

      toast({
        title: "Erro ao verificar status",
        description: "Não foi possível obter o status da instância. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleConnect = (instanceName: string) => {
    setSelectedInstance(instanceName)
    setQrCodeModalOpen(true)
  }

  const handleSetPresence = async (instanceName: string) => {
    if (isLoadingConfig || !config) return

    try {
      const response = await fetch(`${config.evolutionApiUrl}/instance/setPresence/${instanceName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: config.evolutionApiKey,
        },
        body: JSON.stringify({
          presence: "available",
        }),
      })
      const data = await response.json()
      console.log("Set presence response:", data)
      toast({
        title: "Presença Definida",
        description: `Presença da instância ${instanceName} definida como disponível.`,
      })
    } catch (error) {
      console.error("Erro ao definir presença:", error)
      toast({
        title: "Erro ao definir presença",
        description: "Ocorreu um erro ao definir a presença da instância. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold">Instâncias WhatsApp</h3>
      {instances.length === 0 ? (
        <p>Nenhuma instância cadastrada.</p>
      ) : (
        <ul className="space-y-4">
          {instances.map((instance) => (
            <li key={instance.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
              <div>
                <span>{instance.instanceName}</span>
                <Badge className="ml-2" variant={instance.status === "CONNECTED" ? "success" : "secondary"}>
                  {instance.status || "Desconhecido"}
                </Badge>
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => handleCheckStatus(instance.id, instance.instanceName)}
                  size="icon"
                  variant="outline"
                  title="Verificar Status"
                  disabled={isLoadingConfig}
                >
                  <Activity className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleConnect(instance.instanceName)}
                  size="icon"
                  variant="outline"
                  title="Conectar"
                  disabled={isLoadingConfig}
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleSetPresence(instance.instanceName)}
                  size="icon"
                  variant="outline"
                  title="Definir Presença"
                  disabled={isLoadingConfig}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleLogout(instance.instanceName)}
                  size="icon"
                  variant="outline"
                  title="Logout"
                  disabled={isLoadingConfig}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(instance.id, instance.instanceName)}
                  size="icon"
                  variant="destructive"
                  disabled={loadingStates[instance.id] || isLoadingConfig}
                  title="Excluir"
                >
                  {loadingStates[instance.id] ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedInstance && (
        <QRCodeModal
          isOpen={qrCodeModalOpen}
          onClose={() => setQrCodeModalOpen(false)}
          instanceName={selectedInstance}
        />
      )}
    </div>
  )
}

