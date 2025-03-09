"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, SettingsIcon, Calendar, Activity, Server, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useApiConfig } from "@/hooks/useApiConfig"
import { updateInstanceSettings, fetchInstanceSettings, type InstanceSettings } from "@/lib/whatsapp-service"
import { useLoading } from "@/contexts/loading-context"
import type { WhatsAppInstanceDetailed } from "@/types/whatsapp-instance"

interface InstanceDetailsDialogProps {
  instance: WhatsAppInstanceDetailed | null
  isOpen: boolean
  onClose: () => void
  onSettingsUpdated: () => void
}

export function InstanceDetailsDialog({ instance, isOpen, onClose, onSettingsUpdated }: InstanceDetailsDialogProps) {
  const { config } = useApiConfig()
  const { startLoading, stopLoading } = useLoading()
  const [isEditing, setIsEditing] = useState(false)
  const [settings, setSettings] = useState<InstanceSettings | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)

  // Carregar as configurações da API quando o modal é aberto
  useEffect(() => {
    const loadSettings = async () => {
      if (!isOpen || !instance || !config) return

      setIsLoadingSettings(true)
      startLoading("Carregando configurações...")

      try {
        // Buscar as configurações diretamente da API
        const apiSettings = await fetchInstanceSettings(config.evolutionApiUrl, config.evolutionApiKey, instance.name)

        if (apiSettings) {
          setSettings(apiSettings)
        } else {
          // Fallback para as configurações do objeto instance
          setSettings({
            rejectCall: instance.Setting?.rejectCall || false,
            msgCall: instance.Setting?.msgCall || "",
            groupsIgnore: instance.Setting?.groupsIgnore || false,
            alwaysOnline: instance.Setting?.alwaysOnline || false,
            readMessages: instance.Setting?.readMessages || false,
            readStatus: instance.Setting?.readStatus || false,
            syncFullHistory: instance.Setting?.syncFullHistory || false,
          })
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
        toast({
          title: "Erro ao carregar configurações",
          description: "Não foi possível carregar as configurações da instância.",
          variant: "destructive",
        })

        // Definir configurações padrão
        setSettings({
          rejectCall: false,
          msgCall: "",
          groupsIgnore: false,
          alwaysOnline: false,
          readMessages: false,
          readStatus: false,
          syncFullHistory: false,
        })
      } finally {
        setIsLoadingSettings(false)
        stopLoading()
      }
    }

    loadSettings()
  }, [isOpen, instance, config, startLoading, stopLoading])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return "Data inválida"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "connected":
        return "bg-green-500"
      case "connecting":
        return "bg-yellow-500"
      case "close":
      case "disconnected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSaveSettings = async () => {
    if (!config || !settings || !instance) return

    startLoading("Salvando configurações...")

    try {
      await updateInstanceSettings(config.evolutionApiUrl, config.evolutionApiKey, instance.name, settings)

      toast({
        title: "Configurações atualizadas",
        description: "As configurações da instância foram atualizadas com sucesso.",
      })

      setIsEditing(false)
      onSettingsUpdated()
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast({
        title: "Erro ao salvar configurações",
        description: "Ocorreu um erro ao salvar as configurações. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  const handleToggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSettingChange = (key: keyof InstanceSettings, value: boolean | string) => {
    if (!settings) return

    setSettings({
      ...settings,
      [key]: value,
    })
  }

  if (!instance) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(instance.connectionStatus)}`}></div>
            {instance.name}
            <Badge variant={instance.connectionStatus.toLowerCase() === "open" ? "success" : "destructive"}>
              {instance.connectionStatus}
            </Badge>
          </DialogTitle>
          <DialogDescription>ID: {instance.id}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            {instance.profilePicUrl ? (
              <AvatarImage src={instance.profilePicUrl} alt={instance.profileName || instance.name} />
            ) : (
              <AvatarFallback>{instance.profileName?.charAt(0) || instance.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{instance.profileName || "Nome não disponível"}</h3>
            <p className="text-sm text-muted-foreground">
              {instance.ownerJid?.split("@")[0] || "Número não disponível"}
            </p>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>Informações</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Estatísticas</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Configurações</span>
            </TabsTrigger>
            <TabsTrigger value="dates" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Datas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nome da Instância</p>
                <p className="text-sm">{instance.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">ID da Instância</p>
                <p className="text-sm">{instance.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Integração</p>
                <p className="text-sm">{instance.integration}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Cliente</p>
                <p className="text-sm">{instance.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Token</p>
                <p className="text-sm truncate">{instance.token}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant={instance.connectionStatus.toLowerCase() === "open" ? "success" : "destructive"}>
                  {instance.connectionStatus}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg flex flex-col items-center">
                <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                <p className="text-sm font-medium">Mensagens</p>
                <p className="text-2xl font-bold">{instance._count?.Message || 0}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg flex flex-col items-center">
                <Users className="h-8 w-8 mb-2 text-primary" />
                <p className="text-sm font-medium">Contatos</p>
                <p className="text-2xl font-bold">{instance._count?.Contact || 0}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg flex flex-col items-center">
                <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                <p className="text-sm font-medium">Chats</p>
                <p className="text-2xl font-bold">{instance._count?.Chat || 0}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            {isLoadingSettings ? (
              <p className="text-center text-muted-foreground">Carregando configurações...</p>
            ) : settings ? (
              <div className="space-y-4">
                <div className="flex justify-end mb-4">
                  {isEditing ? (
                    <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Configurações
                    </Button>
                  ) : (
                    <Button onClick={handleToggleEdit} variant="outline">
                      Editar Configurações
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <Label htmlFor="alwaysOnline" className="font-medium">
                        Sempre Online
                      </Label>
                      <p className="text-sm text-muted-foreground">Mantém o WhatsApp sempre online</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="alwaysOnline"
                        checked={settings.alwaysOnline}
                        onCheckedChange={(checked) => handleSettingChange("alwaysOnline", checked)}
                      />
                    ) : (
                      <Badge variant={settings.alwaysOnline ? "default" : "secondary"}>
                        {settings.alwaysOnline ? "Sim" : "Não"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <Label htmlFor="groupsIgnore" className="font-medium">
                        Ignorar Grupos
                      </Label>
                      <p className="text-sm text-muted-foreground">Ignora mensagens de grupos</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="groupsIgnore"
                        checked={settings.groupsIgnore}
                        onCheckedChange={(checked) => handleSettingChange("groupsIgnore", checked)}
                      />
                    ) : (
                      <Badge variant={settings.groupsIgnore ? "default" : "secondary"}>
                        {settings.groupsIgnore ? "Sim" : "Não"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <Label htmlFor="readMessages" className="font-medium">
                        Ler Mensagens
                      </Label>
                      <p className="text-sm text-muted-foreground">Marca mensagens como lidas automaticamente</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="readMessages"
                        checked={settings.readMessages}
                        onCheckedChange={(checked) => handleSettingChange("readMessages", checked)}
                      />
                    ) : (
                      <Badge variant={settings.readMessages ? "default" : "secondary"}>
                        {settings.readMessages ? "Sim" : "Não"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <Label htmlFor="readStatus" className="font-medium">
                        Ler Status
                      </Label>
                      <p className="text-sm text-muted-foreground">Visualiza status automaticamente</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="readStatus"
                        checked={settings.readStatus}
                        onCheckedChange={(checked) => handleSettingChange("readStatus", checked)}
                      />
                    ) : (
                      <Badge variant={settings.readStatus ? "default" : "secondary"}>
                        {settings.readStatus ? "Sim" : "Não"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <Label htmlFor="syncFullHistory" className="font-medium">
                        Sincronizar Histórico Completo
                      </Label>
                      <p className="text-sm text-muted-foreground">Sincroniza todo o histórico de mensagens</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="syncFullHistory"
                        checked={settings.syncFullHistory}
                        onCheckedChange={(checked) => handleSettingChange("syncFullHistory", checked)}
                      />
                    ) : (
                      <Badge variant={settings.syncFullHistory ? "default" : "secondary"}>
                        {settings.syncFullHistory ? "Sim" : "Não"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <Label htmlFor="rejectCall" className="font-medium">
                        Rejeitar Chamadas
                      </Label>
                      <p className="text-sm text-muted-foreground">Rejeita chamadas automaticamente</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="rejectCall"
                        checked={settings.rejectCall}
                        onCheckedChange={(checked) => handleSettingChange("rejectCall", checked)}
                      />
                    ) : (
                      <Badge variant={settings.rejectCall ? "default" : "secondary"}>
                        {settings.rejectCall ? "Sim" : "Não"}
                      </Badge>
                    )}
                  </div>

                  {isEditing && settings.rejectCall && (
                    <div className="p-4 border rounded-md">
                      <Label htmlFor="msgCall" className="font-medium">
                        Mensagem para Chamadas Rejeitadas
                      </Label>
                      <Input
                        id="msgCall"
                        value={settings.msgCall || ""}
                        onChange={(e) => handleSettingChange("msgCall", e.target.value)}
                        placeholder="Mensagem enviada quando uma chamada é rejeitada"
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Configurações não disponíveis</p>
            )}
          </TabsContent>

          <TabsContent value="dates">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Criado em</p>
                <p className="text-sm">{formatDate(instance.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Atualizado em</p>
                <p className="text-sm">{formatDate(instance.updatedAt)}</p>
              </div>
              {instance.disconnectionAt && (
                <div>
                  <p className="text-sm font-medium">Desconectado em</p>
                  <p className="text-sm">{formatDate(instance.disconnectionAt)}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

