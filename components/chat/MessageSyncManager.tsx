"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { useApiConfig } from "@/hooks/useApiConfig"
import { auth } from "@/lib/firebase"
import { fetchContacts, syncAllContactMessages } from "@/lib/whatsapp-message-service"
import { RefreshCw, Database, CheckCircle, AlertCircle } from "lucide-react"

interface MessageSyncManagerProps {
  instanceName: string
}

export function MessageSyncManager({ instanceName }: MessageSyncManagerProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [syncStats, setSyncStats] = useState<{
    total: number
    processed: number
    success: number
    failed: number
  }>({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
  })
  const { config } = useApiConfig()

  const handleSync = async () => {
    if (!config || !instanceName || !auth.currentUser) {
      toast({
        title: "Erro de configuração",
        description: "Configurações incompletas. Verifique se você está logado e se a instância está selecionada.",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)
    setSyncStats({
      total: 0,
      processed: 0,
      success: 0,
      failed: 0,
    })
    setProgress(0)

    try {
      // Buscar contatos
      toast({
        title: "Sincronização iniciada",
        description: "Buscando contatos...",
      })

      const contacts = await fetchContacts(config.evolutionApiUrl, config.evolutionApiKey, instanceName)

      if (contacts.length === 0) {
        toast({
          title: "Nenhum contato encontrado",
          description: "Não foi possível encontrar contatos para sincronizar mensagens.",
          variant: "destructive",
        })
        setIsSyncing(false)
        return
      }

      setSyncStats((prev) => ({
        ...prev,
        total: contacts.length,
      }))

      toast({
        title: "Sincronizando mensagens",
        description: `Iniciando sincronização para ${contacts.length} contatos...`,
      })

      // Sincronizar mensagens de todos os contatos
      const result = await syncAllContactMessages(
        config.evolutionApiUrl,
        config.evolutionApiKey,
        instanceName,
        auth.currentUser.uid,
        contacts,
      )

      setSyncStats({
        total: result.total,
        processed: result.total,
        success: result.success,
        failed: result.failed,
      })
      setProgress(100)

      toast({
        title: "Sincronização concluída",
        description: `${result.success} contatos sincronizados com sucesso. ${result.failed} falhas.`,
      })
    } catch (error) {
      console.error("Erro durante a sincronização:", error)
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro durante a sincronização das mensagens.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Sincronização de Mensagens
        </CardTitle>
        <CardDescription>Sincronize as mensagens de todos os seus contatos com o banco de dados</CardDescription>
      </CardHeader>
      <CardContent>
        {isSyncing ? (
          <div className="space-y-4">
            <Progress value={progress} className="h-2 w-full" />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm font-medium">Processados</p>
                <p className="text-2xl font-bold">
                  {syncStats.processed}/{syncStats.total}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="flex justify-center gap-4 mt-1">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span>{syncStats.success}</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                    <span>{syncStats.failed}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Esta operação irá buscar todas as mensagens de todos os seus contatos e salvá-las no banco de dados. Isso
            pode levar algum tempo dependendo do número de contatos e mensagens.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSync} disabled={isSyncing || !config || !instanceName} className="w-full">
          {isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar Mensagens
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

