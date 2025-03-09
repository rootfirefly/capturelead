"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { QRCodeSVG } from "qrcode.react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { auth } from "@/lib/firebase"
import { useApiConfig } from "@/hooks/useApiConfig"

interface WhatsAppInstanceCreatorProps {
  onInstanceCreated: (instanceName: string, instanceId: string) => void
}

export function WhatsAppInstanceCreator({ onInstanceCreated }: WhatsAppInstanceCreatorProps) {
  const [instanceName, setInstanceName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const { config, isLoading: isLoadingConfig } = useApiConfig()

  const sanitizeInstanceName = (name: string) => {
    // Remove spaces and special characters, keep only alphanumeric characters and underscores
    return name.replace(/[^a-zA-Z0-9_]/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoadingConfig || !config) {
      toast({
        title: "Configurações não carregadas",
        description: "Aguarde o carregamento das configurações da API ou verifique se estão configuradas corretamente.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setQrCode(null)

    const now = new Date()
    const timestamp = now
      .toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/[^0-9]/g, "")

    const sanitizedInstanceName = sanitizeInstanceName(instanceName)
    const fullInstanceName = `${sanitizedInstanceName}_${timestamp}`

    try {
      const response = await fetch(`${config.evolutionApiUrl}/instance/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: config.evolutionApiKey,
        },
        body: JSON.stringify({
          instanceName: fullInstanceName,
          webhookEvents: ["GROUPS_UPSERT"],
          alwaysOnline: true,
          groupsIgnore: true,
          integration: "WHATSAPP-BAILEYS",
        }),
      })

      const data = await response.json()
      console.log("Create instance response:", data)

      if (!response.ok) {
        throw new Error(data.message || "Falha ao criar instância")
      }

      if (data.qrcode) {
        setQrCode(data.qrcode)
      }

      // Add the instance to Firestore with initial status
      const docRef = await addDoc(collection(db, "whatsapp_instances"), {
        instanceName: fullInstanceName,
        status: "created",
        userId: auth.currentUser?.uid,
        createdAt: now,
      })

      onInstanceCreated(fullInstanceName, docRef.id)
      setInstanceName("")
      toast({
        title: "Instância criada com sucesso",
        description: `A instância ${fullInstanceName} foi criada.`,
      })
    } catch (error) {
      console.error("Erro ao criar instância:", error)
      toast({
        title: "Erro ao criar instância",
        description: "Ocorreu um erro ao criar a instância do WhatsApp. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={instanceName}
          onChange={(e) => setInstanceName(e.target.value)}
          placeholder="Nome da instância (apenas letras, números e underscores)"
          required
        />
        <Button type="submit" disabled={isLoading || isLoadingConfig}>
          {isLoading ? "Criando..." : "Criar Instância"}
        </Button>
      </form>
      {qrCode && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">QR Code para Conexão</h3>
          <QRCodeSVG value={qrCode} size={256} />
          <p className="mt-2 text-sm text-gray-600">Escaneie este QR code com seu WhatsApp para conectar sua conta.</p>
        </div>
      )}
    </div>
  )
}

