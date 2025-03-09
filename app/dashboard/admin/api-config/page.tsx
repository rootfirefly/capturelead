"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { auth } from "@/lib/firebase"
import { getApiConfig, saveApiConfig } from "@/lib/api-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { useLoading } from "@/contexts/loading-context"
import { AdminGuard } from "@/components/AdminGuard"
import type { ApiConfig } from "@/types/api-config"

// Primeiro, adicione o import dos ícones de olho para mostrar/ocultar a senha
import { Eye, EyeOff } from "lucide-react"

const apiConfigSchema = z.object({
  evolutionApiUrl: z.string().url("URL inválida").min(1, "URL é obrigatória"),
  evolutionApiKey: z.string().min(1, "Chave da API é obrigatória"),
})

type ApiConfigFormValues = z.infer<typeof apiConfigSchema>

export default function ApiConfigPage() {
  const [currentConfig, setCurrentConfig] = useState<ApiConfig | null>(null)
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()

  // Adicione o estado para controlar a visibilidade da chave da API logo após os outros estados
  const [showApiKey, setShowApiKey] = useState(false)

  const form = useForm<ApiConfigFormValues>({
    resolver: zodResolver(apiConfigSchema),
    defaultValues: {
      evolutionApiUrl: "",
      evolutionApiKey: "",
    },
  })

  useEffect(() => {
    const loadConfig = async () => {
      startLoading("Carregando configurações...")

      try {
        // Carregar configuração atual
        const config = await getApiConfig()
        setCurrentConfig(config)

        // Preencher o formulário com os valores atuais
        form.reset({
          evolutionApiUrl: config.evolutionApiUrl,
          evolutionApiKey: config.evolutionApiKey,
        })
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações da API.",
          variant: "destructive",
        })
      } finally {
        stopLoading()
      }
    }

    loadConfig()
  }, [form, startLoading, stopLoading])

  const onSubmit = async (data: ApiConfigFormValues) => {
    if (!auth.currentUser) {
      router.push("/login")
      return
    }

    startLoading("Salvando configurações...")

    try {
      await saveApiConfig(
        {
          ...data,
          id: currentConfig?.id,
          createdAt: currentConfig?.createdAt,
          createdBy: currentConfig?.createdBy,
        },
        auth.currentUser.uid,
      )

      toast({
        title: "Configurações salvas",
        description: "As configurações da API foram atualizadas com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações da API.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  return (
    <AdminGuard>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Configurações da API</CardTitle>
            <CardDescription>Configure os parâmetros da API da Evolution</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="evolutionApiUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da API</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://api.example.com" />
                      </FormControl>
                      <FormDescription>
                        URL base da API da Evolution (ex: https://api.nexuinsolution.com.br)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="evolutionApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave da API</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input {...field} type={showApiKey ? "text" : "password"} placeholder="sua-chave-api" />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">{showApiKey ? "Ocultar" : "Mostrar"} chave da API</span>
                        </Button>
                      </div>
                      <FormDescription>Chave de autenticação para a API da Evolution</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Salvar Configurações</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  )
}

