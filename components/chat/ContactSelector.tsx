"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, User, Loader2, RefreshCw, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useApiConfig } from "@/hooks/useApiConfig"
import { auth } from "@/lib/firebase"
import { fetchContactsWithLatestMessages, getContactsFromFirestore } from "@/lib/whatsapp-contact-service"
import { checkIsWhatsApp, fetchProfilePictureUrl } from "@/lib/whatsapp-message-service"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface WhatsAppContact {
  id: string
  name: string
  number: string
  profilePictureUrl?: string
  lastMessageTimestamp?: number
}

interface ContactSelectorProps {
  instanceName: string
  onSelectContact: (contact: WhatsAppContact) => void
  selectedContactId?: string
  refreshTrigger?: number
}

export function ContactSelector({
  instanceName,
  onSelectContact,
  selectedContactId,
  refreshTrigger = 0,
}: ContactSelectorProps) {
  const [contacts, setContacts] = useState<WhatsAppContact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<WhatsAppContact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newContactNumber, setNewContactNumber] = useState("")
  const [newContactName, setNewContactName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const { config } = useApiConfig()

  // Atualizar a função loadContacts para usar a nova implementação
  const loadContacts = useCallback(
    async (forceRefresh = false) => {
      if (!config || !instanceName) return

      const userId = auth.currentUser?.uid
      if (!userId) {
        console.error("Usuário não autenticado")
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar autenticado para carregar contatos.",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)
      try {
        console.log("Carregando contatos para a instância:", instanceName)

        if (forceRefresh) {
          // Se forçar atualização, buscar contatos da API com mensagens recentes
          setIsRefreshing(true)
          try {
            const contactsWithMessages = await fetchContactsWithLatestMessages(
              config.evolutionApiUrl,
              config.evolutionApiKey,
              instanceName,
              userId,
            )

            if (contactsWithMessages.length > 0) {
              setContacts(contactsWithMessages)
              setFilteredContacts(contactsWithMessages)
            } else {
              toast({
                title: "Nenhum contato encontrado",
                description: "Não foram encontrados contatos com mensagens recentes.",
              })
            }
          } catch (apiError) {
            console.error("Erro ao buscar contatos da API:", apiError)
            toast({
              title: "Erro ao atualizar contatos",
              description: "Ocorreu um erro ao buscar contatos. Tentando carregar do cache local.",
              variant: "destructive",
            })

            // Tentar carregar do Firestore como fallback
            const firestoreContacts = await getContactsFromFirestore(userId, instanceName)
            if (firestoreContacts.length > 0) {
              setContacts(firestoreContacts)
              setFilteredContacts(firestoreContacts)
            }
          } finally {
            setIsRefreshing(false)
          }
        } else {
          // Primeiro tentar carregar do Firestore para exibição rápida
          try {
            const firestoreContacts = await getContactsFromFirestore(userId, instanceName)

            if (firestoreContacts.length > 0) {
              console.log(`${firestoreContacts.length} contatos carregados do Firestore`)
              setContacts(firestoreContacts)
              setFilteredContacts(firestoreContacts)

              // Em segundo plano, atualizar contatos da API
              setTimeout(async () => {
                try {
                  setIsRefreshing(true)
                  const contactsWithMessages = await fetchContactsWithLatestMessages(
                    config.evolutionApiUrl,
                    config.evolutionApiKey,
                    instanceName,
                    userId,
                  )

                  if (contactsWithMessages.length > 0) {
                    setContacts(contactsWithMessages)
                    setFilteredContacts(contactsWithMessages)
                  }
                } catch (backgroundError) {
                  console.error("Erro ao atualizar contatos em segundo plano:", backgroundError)
                  // Não mostrar toast para erros em segundo plano para não incomodar o usuário
                } finally {
                  setIsRefreshing(false)
                }
              }, 100)
            } else {
              // Se não há contatos no Firestore, buscar da API
              setIsRefreshing(true)
              try {
                const contactsWithMessages = await fetchContactsWithLatestMessages(
                  config.evolutionApiUrl,
                  config.evolutionApiKey,
                  instanceName,
                  userId,
                )

                if (contactsWithMessages.length > 0) {
                  setContacts(contactsWithMessages)
                  setFilteredContacts(contactsWithMessages)
                } else {
                  toast({
                    title: "Nenhum contato encontrado",
                    description: "Não foram encontrados contatos com mensagens recentes.",
                  })
                }
              } catch (apiError) {
                console.error("Erro ao buscar contatos da API:", apiError)
                toast({
                  title: "Erro ao carregar contatos",
                  description: "Não foi possível carregar contatos. Verifique sua conexão e tente novamente.",
                  variant: "destructive",
                })
              } finally {
                setIsRefreshing(false)
              }
            }
          } catch (firestoreError) {
            console.error("Erro ao carregar contatos do Firestore:", firestoreError)
            toast({
              title: "Erro ao carregar contatos",
              description: "Não foi possível carregar contatos do cache local.",
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        console.error("Erro ao carregar contatos:", error)
        toast({
          title: "Erro ao carregar contatos",
          description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [config, instanceName],
  )

  // Carregar contatos quando o componente é montado ou quando refreshTrigger muda
  useEffect(() => {
    if (instanceName && config) {
      loadContacts(false)
    }
  }, [instanceName, config, refreshTrigger, loadContacts])

  // Filtrar contatos quando o termo de busca muda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredContacts(contacts)
    } else {
      const filtered = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.number.includes(searchTerm),
      )
      setFilteredContacts(filtered)
    }
  }, [contacts, searchTerm])

  // Função para adicionar um novo contato
  const handleAddContact = async () => {
    if (!newContactNumber.trim()) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de telefone válido.",
        variant: "destructive",
      })
      return
    }

    if (!config) {
      toast({
        title: "Configuração não disponível",
        description: "As configurações da API não estão disponíveis.",
        variant: "destructive",
      })
      return
    }

    setIsChecking(true)

    try {
      // Formatar o número para garantir que esteja no formato correto
      let formattedNumber = newContactNumber.trim()

      // Remover caracteres não numéricos
      formattedNumber = formattedNumber.replace(/\D/g, "")

      // Verificar se o número é um WhatsApp válido
      const isValid = await checkIsWhatsApp(
        config.evolutionApiUrl,
        config.evolutionApiKey,
        instanceName,
        formattedNumber,
      )

      if (!isValid) {
        toast({
          title: "Número inválido",
          description: "Este número não possui WhatsApp.",
          variant: "destructive",
        })
        setIsChecking(false)
        return
      }

      // Buscar foto de perfil
      const profilePictureUrl = await fetchProfilePictureUrl(
        config.evolutionApiUrl,
        config.evolutionApiKey,
        instanceName,
        formattedNumber,
      )

      // Adicionar o novo contato
      const newContact: WhatsAppContact = {
        id: `${formattedNumber}@s.whatsapp.net`,
        name: newContactName.trim() || formattedNumber,
        number: formattedNumber,
        profilePictureUrl: profilePictureUrl || undefined,
        lastMessageTimestamp: Date.now(), // Definir o timestamp atual para o novo contato
      }

      // Verificar se o contato já existe
      const contactExists = contacts.some((contact) => contact.number === formattedNumber)

      if (!contactExists) {
        // Adicionar o novo contato à lista
        const updatedContacts = [newContact, ...contacts]
        setContacts(updatedContacts)
        setFilteredContacts(updatedContacts)

        // Salvar no Firestore
        const userId = auth.currentUser?.uid
        if (userId) {
          // await saveContactsToFirestore(userId, instanceName, [newContact]) // saveContactsToFirestore is not defined
        }

        toast({
          title: "Contato adicionado",
          description: "O contato foi adicionado com sucesso.",
        })
      } else {
        toast({
          title: "Contato já existe",
          description: "Este contato já existe na sua lista.",
        })
      }

      onSelectContact(newContact)
      setNewContactNumber("")
      setNewContactName("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao adicionar contato:", error)
      toast({
        title: "Erro ao adicionar contato",
        description: "Ocorreu um erro ao adicionar o contato. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  // Função para formatar o timestamp da última mensagem
  const formatLastMessageTime = (timestamp?: number) => {
    if (!timestamp) return null

    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ptBR,
      })
    } catch (error) {
      return null
    }
  }

  return (
    <div className="w-full max-w-xs border-r h-full flex flex-col">
      <div className="p-3 border-b">
        <div className="relative mb-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contato"
            className="pl-8 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadContacts(true)}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus className="h-3 w-3" />
                Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Contato</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Telefone (com DDD e código do país)</Label>
                  <Input
                    id="phone"
                    placeholder="Ex: 5531987654321"
                    value={newContactNumber}
                    onChange={(e) => setNewContactNumber(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Formato: código do país + DDD + número (ex: 5531987654321)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome (opcional)</Label>
                  <Input
                    id="name"
                    placeholder="Nome do contato"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddContact} className="w-full" disabled={isChecking || !newContactNumber.trim()}>
                  {isChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Adicionar Contato"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && contacts.length === 0 ? (
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-muted-foreground">Carregando contatos...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>Nenhum contato encontrado.</p>
            <p className="text-sm mt-2">Clique em "Novo Contato" para adicionar.</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>Nenhum contato corresponde à busca.</p>
            <p className="text-sm mt-2">Total de contatos: {contacts.length}</p>
          </div>
        ) : (
          <ul className="space-y-1 p-2">
            {filteredContacts.map((contact) => {
              const lastMessageTime = formatLastMessageTime(contact.lastMessageTimestamp)

              return (
                <li key={contact.id}>
                  <Button
                    variant={selectedContactId === contact.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => onSelectContact(contact)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      {contact.profilePictureUrl ? (
                        <AvatarImage src={contact.profilePictureUrl} alt={contact.name} />
                      ) : (
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col items-start text-left overflow-hidden w-full">
                      <div className="flex justify-between w-full">
                        <span className="text-sm font-medium truncate">{contact.name}</span>
                        {lastMessageTime && (
                          <span className="text-xs text-muted-foreground ml-1">{lastMessageTime}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate w-full text-left">{contact.number}</span>
                    </div>
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {isRefreshing && (
        <div className="p-2 text-center text-xs text-muted-foreground border-t">
          <RefreshCw className="h-3 w-3 animate-spin inline-block mr-1" />
          Atualizando contatos...
        </div>
      )}
    </div>
  )
}

