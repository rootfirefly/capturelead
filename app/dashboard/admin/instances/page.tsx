"use client"

import { useState, useEffect } from "react"
import { useWhatsAppInstances } from "@/hooks/useWhatsAppInstances"
import { AdminGuard } from "@/components/AdminGuard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InstanceDetailsDialog } from "@/components/InstanceDetailsDialog"
import { Eye, RefreshCw, Clock } from "lucide-react"
import { useLoading } from "@/contexts/loading-context"
import type { WhatsAppInstanceDetailed } from "@/types/whatsapp-instance"

export default function AdminInstancesPage() {
  const { instances, isLoading, error, refetch, updateInstanceInCache } = useWhatsAppInstances()
  const [selectedInstance, setSelectedInstance] = useState<WhatsAppInstanceDetailed | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { startLoading, stopLoading } = useLoading()

  // Usar useEffect apenas para gerenciar o indicador de carregamento global
  useEffect(() => {
    if (isLoading && !isRefreshing) {
      startLoading("Carregando instâncias...")
    } else {
      stopLoading()
    }

    // Atualizar o timestamp da última atualização quando os dados são carregados
    if (!isLoading && instances.length > 0) {
      setLastUpdated(new Date())
    }
  }, [isLoading, startLoading, stopLoading, instances, isRefreshing])

  const handleViewDetails = (instance: WhatsAppInstanceDetailed) => {
    setSelectedInstance(instance)
    setIsDetailsOpen(true)
  }

  const handleSettingsUpdated = () => {
    // Quando as configurações são atualizadas, apenas atualizamos a instância específica
    if (selectedInstance) {
      // Primeiro atualizamos o cache com os dados que temos
      const updatedInstance = { ...selectedInstance, updatedAt: new Date().toISOString() }
      updateInstanceInCache(updatedInstance)

      // Depois fazemos um refetch para garantir que temos os dados mais recentes
      handleRefresh()
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
    setLastUpdated(new Date())
  }

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

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === "open" || statusLower === "connected") {
      return <Badge variant="success">Conectado</Badge>
    } else if (statusLower === "connecting") {
      return <Badge variant="warning">Conectando</Badge>
    } else {
      return <Badge variant="destructive">Desconectado</Badge>
    }
  }

  if (error) {
    return (
      <AdminGuard>
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>Erro ao Carregar Instâncias</CardTitle>
              <CardDescription>Ocorreu um erro ao carregar as instâncias do WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error.message}</p>
              <Button className="mt-4" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gerenciamento de Instâncias WhatsApp</CardTitle>
                <CardDescription>
                  Visualize e gerencie todas as instâncias do WhatsApp registradas no sistema.
                </CardDescription>
                {lastUpdated && (
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Última atualização: {formatDate(lastUpdated.toISOString())}
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Mensagens</TableHead>
                    <TableHead>Contatos</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        {isLoading ? "Carregando instâncias..." : "Nenhuma instância encontrada"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    instances.map((instance) => (
                      <TableRow key={instance.id}>
                        <TableCell className="font-medium">{instance.name}</TableCell>
                        <TableCell>{getStatusBadge(instance.connectionStatus)}</TableCell>
                        <TableCell>{instance.profileName || "N/A"}</TableCell>
                        <TableCell>{instance._count?.Message || 0}</TableCell>
                        <TableCell>{instance._count?.Contact || 0}</TableCell>
                        <TableCell>{formatDate(instance.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(instance)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <InstanceDetailsDialog
          instance={selectedInstance}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onSettingsUpdated={handleSettingsUpdated}
        />
      </div>
    </AdminGuard>
  )
}

