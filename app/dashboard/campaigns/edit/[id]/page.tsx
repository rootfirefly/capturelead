"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"

interface FormField {
  id: string
  name: string
  label: string
  type: string
  required: boolean
}

interface Campaign {
  id: string
  name: string
  description: string
  fields: FormField[]
}

export default function EditCampaign({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const docRef = doc(db, "campaigns", params.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() } as Campaign)
        } else {
          router.push("/404")
        }
      } catch (error) {
        console.error("Error fetching campaign:", error)
        toast({
          title: "Erro ao carregar campanha",
          description: "Não foi possível carregar os detalhes da campanha.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaign()
  }, [params.id, router])

  const addField = () => {
    if (campaign) {
      setCampaign({
        ...campaign,
        fields: [...campaign.fields, { id: uuidv4(), name: "", label: "", type: "text", required: false }],
      })
    }
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    if (campaign) {
      setCampaign({
        ...campaign,
        fields: campaign.fields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
      })
    }
  }

  const removeField = (id: string) => {
    if (campaign) {
      setCampaign({
        ...campaign,
        fields: campaign.fields.filter((field) => field.id !== id),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!campaign) return

    try {
      await updateDoc(doc(db, "campaigns", campaign.id), {
        name: campaign.name,
        description: campaign.description,
        fields: campaign.fields,
      })

      toast({
        title: "Campanha atualizada com sucesso!",
        description: "As alterações foram salvas.",
      })

      router.push("/dashboard/campaigns")
    } catch (error) {
      console.error("Error updating campaign:", error)
      toast({
        title: "Erro ao atualizar campanha",
        description: "Ocorreu um erro ao atualizar a campanha. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!campaign) {
    return <div>Campanha não encontrada.</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Campanha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nome da Campanha
              </label>
              <Input
                id="name"
                value={campaign.name}
                onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrição (opcional)
              </label>
              <Textarea
                id="description"
                value={campaign.description}
                onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Campos do Formulário</h3>
                <Button type="button" onClick={addField}>
                  Adicionar Campo
                </Button>
              </div>
              {campaign.fields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Input
                    placeholder="Nome do campo"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Rótulo do campo"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    required
                  />
                  <Select value={field.type} onValueChange={(value) => updateField(field.id, { type: value })}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tipo do campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tel">Telefone</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => updateField(field.id, { required: !field.required })}
                  >
                    {field.required ? "Obrigatório" : "Opcional"}
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => removeField(field.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

