"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useActiveWhatsAppInstances } from "@/hooks/useActiveWhatsAppInstances"
import { InstanceSelector } from "@/components/chat/InstanceSelector"
import { ContactSelector } from "@/components/chat/ContactSelector"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { useLoading } from "@/contexts/loading-context"
import { User } from "lucide-react"

interface Contact {
  id: string
  name: string
  number: string
  profilePictureUrl?: string
}

export default function WhatsAppChatPage() {
  const { instances, isLoading } = useActiveWhatsAppInstances()
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { startLoading, stopLoading } = useLoading()

  // Gerenciar o indicador de carregamento global
  useEffect(() => {
    if (isLoading) {
      startLoading("Carregando instâncias ativas...")
    } else {
      stopLoading()
    }
  }, [isLoading, startLoading, stopLoading])

  // Selecionar automaticamente a primeira instância disponível
  useEffect(() => {
    if (!isLoading && instances.length > 0 && !selectedInstance) {
      setSelectedInstance(instances[0].instanceName)
    }
  }, [instances, isLoading, selectedInstance])

  const handleSelectInstance = (instanceName: string) => {
    setSelectedInstance(instanceName)
    setSelectedContact(null) // Resetar o contato selecionado ao mudar de instância
  }

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
  }

  // Função para atualizar a lista de contatos quando uma nova mensagem é recebida
  const handleNewMessage = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  if (instances.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Nenhuma instância ativa encontrada</h2>
              <p className="text-muted-foreground">
                Você precisa ter pelo menos uma instância de WhatsApp conectada para usar o chat.
              </p>
              <p className="mt-4">
                <a href="/dashboard/whatsapp" className="text-primary hover:underline">
                  Ir para gerenciamento de instâncias
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Chat WhatsApp</h1>

      <InstanceSelector
        instances={instances}
        selectedInstance={selectedInstance}
        onSelectInstance={handleSelectInstance}
      />

      {selectedInstance && (
        <Card className="h-[calc(100vh-200px)]">
          <CardContent className="p-0 h-full">
            <div className="flex h-full">
              <ContactSelector
                instanceName={selectedInstance}
                onSelectContact={handleSelectContact}
                selectedContactId={selectedContact?.id}
                refreshTrigger={refreshTrigger}
              />

              {selectedContact ? (
                <div className="flex-1">
                  <ChatInterface
                    instanceName={selectedInstance}
                    contactNumber={selectedContact.number}
                    contactName={selectedContact.name}
                    profilePictureUrl={selectedContact.profilePictureUrl}
                    onNewMessage={handleNewMessage}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center p-6">
                    <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">Selecione um contato para iniciar uma conversa</p>
                    <p className="text-xs text-muted-foreground">
                      Ou use o botão "Novo Contato" para adicionar um novo número
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

