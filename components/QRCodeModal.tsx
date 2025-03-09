"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useApiConfig } from "@/hooks/useApiConfig"
import { useLoading } from "@/contexts/loading-context"
import { Preloader } from "@/components/ui/preloader"

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  instanceName: string
}

export function QRCodeModal({ isOpen, onClose, instanceName }: QRCodeModalProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("Desconhecido")
  const [error, setError] = useState<string | null>(null)
  const [isLoadingQR, setIsLoadingQR] = useState(false)
  const { config, isLoading: isLoadingConfig } = useApiConfig()
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    if (isOpen && !isLoadingConfig && config) {
      fetchQRCode()
    }
  }, [isOpen, config, isLoadingConfig])

  const fetchQRCode = async () => {
    if (!config) return

    setIsLoadingQR(true)
    startLoading("Obtendo QR Code...")

    try {
      const response = await fetch(`${config.evolutionApiUrl}/instance/connect/${instanceName}`, {
        method: "GET",
        headers: {
          apikey: config.evolutionApiKey,
        },
      })
      const data = await response.json()
      console.log("Connect instance response:", data)
      if (data.base64) {
        setQrCode(data.base64)
        setStatus("Aguardando conexão")
      } else {
        setStatus("Conectado")
        setError("QR Code não disponível. A instância já está conectada.")
      }
    } catch (error) {
      console.error("Erro ao obter QR code:", error)
      setError("Erro ao obter QR code. Por favor, tente novamente.")
      setStatus("Erro")
    } finally {
      setIsLoadingQR(false)
      stopLoading()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Conectar Instância: {instanceName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <Badge
            variant={status === "Conectado" ? "success" : status === "Erro" ? "destructive" : "secondary"}
            className="mb-4"
          >
            Status: {status}
          </Badge>
          {isLoadingConfig || isLoadingQR ? (
            <Preloader size="md" text="Carregando QR Code..." />
          ) : qrCode ? (
            <div className="mt-4 flex flex-col items-center">
              <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-96 h-96" />
              <p className="mt-4 text-sm text-center text-gray-600">
                Escaneie este QR code com seu WhatsApp para conectar sua conta.
              </p>
            </div>
          ) : error ? (
            <p className="text-red-500 mt-4 text-center">{error}</p>
          ) : (
            <p className="mt-4 text-center">Carregando QR code...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

