"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { SendHorizonal, Paperclip, Smile, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChatMessageBubble } from "./ChatMessage"
import { useApiConfig } from "@/hooks/useApiConfig"
import { auth } from "@/lib/firebase"
import {
  sendTextMessage,
  fetchProfilePictureUrl,
  saveMessageToFirestore,
  fetchMessagesFromFirestore,
  type ChatMessage,
  updateContactLastMessageTimestamp,
  startMessagePolling,
  isMessageInList,
  fetchContactMessages,
} from "@/lib/whatsapp-message-service"
import { toast } from "@/components/ui/use-toast"

interface ChatInterfaceProps {
  instanceName: string
  contactNumber: string
  contactName?: string
  profilePictureUrl?: string
  onNewMessage?: () => void // Callback para notificar quando uma nova mensagem é recebida
}

export function ChatInterface({
  instanceName,
  contactNumber,
  contactName,
  profilePictureUrl: initialProfilePictureUrl,
  onNewMessage,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(initialProfilePictureUrl || null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<{ stop: () => void } | null>(null)
  const { config } = useApiConfig()

  // Formatar o número para garantir que esteja no formato correto
  const formattedNumber = contactNumber.includes("@") ? contactNumber : `${contactNumber}@s.whatsapp.net`

  // Função para lidar com novas mensagens recebidas durante o polling
  const handleNewPollingMessages = (newMessages: ChatMessage[]) => {
    setMessages((prevMessages) => {
      // Filtrar mensagens que já existem para evitar duplicatas
      const filteredNewMessages = newMessages.filter((msg) => !isMessageInList(msg, prevMessages))

      if (filteredNewMessages.length === 0) return prevMessages

      console.log(`Adicionando ${filteredNewMessages.length} novas mensagens`)

      // Adicionar as novas mensagens e ordenar por timestamp
      const updatedMessages = [...prevMessages, ...filteredNewMessages]
      updatedMessages.sort((a, b) => a.timestamp - b.timestamp)

      // Notificar que novas mensagens foram recebidas
      if (onNewMessage) {
        setTimeout(() => {
          onNewMessage()
        }, 0)
      }

      return updatedMessages
    })
  }

  // Buscar foto de perfil se não foi fornecida
  useEffect(() => {
    const loadProfilePicture = async () => {
      if (!config || !instanceName || !contactNumber || initialProfilePictureUrl) return

      try {
        const pictureUrl = await fetchProfilePictureUrl(
          config.evolutionApiUrl,
          config.evolutionApiKey,
          instanceName,
          contactNumber,
        )

        if (pictureUrl) {
          setProfilePictureUrl(pictureUrl)
        }
      } catch (error) {
        console.error("Erro ao carregar foto de perfil:", error)
      }
    }

    loadProfilePicture()
  }, [config, instanceName, contactNumber, initialProfilePictureUrl])

  // Carregar mensagens quando uma conversa é selecionada
  useEffect(() => {
    const loadMessages = async () => {
      if (!config || !instanceName || !contactNumber) return

      setIsLoading(true)
      try {
        console.log("Buscando mensagens para:", formattedNumber)

        const userId = auth.currentUser?.uid
        if (!userId) {
          console.error("Usuário não autenticado")
          setIsLoading(false)
          return
        }

        try {
          // Buscar mensagens diretamente da API
          const apiMessages = await fetchContactMessages(
            config.evolutionApiUrl,
            config.evolutionApiKey,
            instanceName,
            formattedNumber,
          )

          if (apiMessages.length > 0) {
            console.log(`${apiMessages.length} mensagens carregadas da API`)

            // Ordenar por timestamp
            apiMessages.sort((a, b) => a.timestamp - b.timestamp)
            setMessages(apiMessages)

            // Salvar mensagens no Firestore em segundo plano
            setTimeout(async () => {
              try {
                for (const message of apiMessages) {
                  await saveMessageToFirestore(userId, instanceName, message)
                }
                console.log("Mensagens salvas no Firestore com sucesso")
              } catch (saveError) {
                console.error("Erro ao salvar mensagens no Firestore:", saveError)
              }
            }, 100)
          } else {
            console.log("Nenhuma mensagem encontrada para este contato")
            setMessages([])
          }
        } catch (apiError) {
          console.error("Erro ao buscar mensagens da API:", apiError)
          toast({
            title: "Erro ao carregar mensagens",
            description: "Não foi possível carregar as mensagens deste contato. Tentando carregar do cache local.",
            variant: "destructive",
          })

          // Tentar carregar do Firestore como fallback
          const firestoreMessages = await fetchMessagesFromFirestore(userId, instanceName, formattedNumber)
          if (firestoreMessages.length > 0) {
            firestoreMessages.sort((a, b) => a.timestamp - b.timestamp)
            setMessages(firestoreMessages)
          } else {
            setMessages([])
          }
        }
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error)
        toast({
          title: "Erro ao carregar mensagens",
          description: "Não foi possível carregar o histórico de mensagens.",
          variant: "destructive",
        })
        setMessages([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [config, instanceName, contactNumber, formattedNumber])

  // Função para iniciar o polling de novas mensagens
  const startPollingForNewMessages = (currentMessages: ChatMessage[]) => {
    // Parar polling anterior se existir
    if (pollingRef.current) {
      pollingRef.current.stop()
    }

    if (!config || !auth.currentUser) return

    // Iniciar novo polling
    pollingRef.current = startMessagePolling(
      config.evolutionApiUrl,
      config.evolutionApiKey,
      instanceName,
      auth.currentUser.uid,
      formattedNumber,
      handleNewPollingMessages,
      currentMessages,
      5000, // Verificar a cada 5 segundos
    )

    console.log("Polling de novas mensagens iniciado")
  }

  // Rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim() || !config) return

    setIsSending(true)
    try {
      // Garantir que o número esteja no formato correto
      let targetNumber = formattedNumber

      // Se não tiver @, adicionar o sufixo
      if (!targetNumber.includes("@")) {
        targetNumber = `${targetNumber}@s.whatsapp.net`
      }

      console.log("Enviando mensagem para:", targetNumber)

      const response = await sendTextMessage(config.evolutionApiUrl, config.evolutionApiKey, instanceName, {
        number: targetNumber,
        text: message,
      })

      if (response) {
        // Adicionar a mensagem enviada ao histórico
        const newMessage: ChatMessage = {
          id: response.key?.id || Date.now().toString(),
          text: message,
          timestamp: Date.now(),
          fromMe: true,
          sender: response.key?.remoteJid || targetNumber,
          status: response.status || "sent",
        }

        // Salvar a mensagem no Firestore
        const userId = auth.currentUser?.uid
        if (userId) {
          await saveMessageToFirestore(userId, instanceName, newMessage)

          // Atualizar o timestamp da última mensagem para este contato
          await updateContactLastMessageTimestamp(userId, instanceName, targetNumber, Date.now())

          // Notificar que uma nova mensagem foi enviada para atualizar a lista de contatos
          if (onNewMessage) {
            setTimeout(() => {
              onNewMessage()
            }, 0)
          }
        }

        setMessages((prev) => [...prev, newMessage])
        setMessage("")
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho do chat */}
      <div className="p-3 border-b bg-card">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            {profilePictureUrl ? (
              <AvatarImage src={profilePictureUrl} alt={contactName || contactNumber} />
            ) : (
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium">{contactName || contactNumber}</h3>
            <p className="text-sm text-muted-foreground">{contactName ? contactNumber : ""}</p>
          </div>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p className="text-muted-foreground">Carregando mensagens...</p>
          </div>
        ) : isSyncing ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p className="text-muted-foreground">Sincronizando mensagens...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">Nenhuma mensagem ainda. Comece a conversar!</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Área de input */}
      <div className="p-3 border-t bg-background">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite uma mensagem"
              className="min-h-[40px] max-h-[120px] resize-none pr-10"
              rows={1}
              disabled={isSending}
            />
            <Button variant="ghost" size="icon" className="absolute right-2 bottom-1 rounded-full">
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="rounded-full"
            disabled={!message.trim() || isSending}
          >
            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

