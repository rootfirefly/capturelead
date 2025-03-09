"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import { db, auth } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLoading } from "@/contexts/loading-context"

interface FormField {
  id: string
  name: string
  label: string
  type: string
  required: boolean
}

export default function CreateCampaign() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [raffleDate, setRaffleDate] = useState<Date | undefined>(undefined)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()

  const addField = () => {
    setFields([...fields, { id: uuidv4(), name: "", label: "", type: "text", required: false }])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault()

    const user = auth.currentUser
    if (!user) {
      router.push("/login")
      return
    }

    if (!raffleDate) {
      toast({
        title: "Data do sorteio é obrigatória",
        description: "Por favor, selecione a data do sorteio.",
        variant: "destructive",
      })
      return
    }

    if (!termsAccepted) {
      toast({
        title: "Termos não aceitos",
        description: "Por favor, aceite os termos para criar a campanha.",
        variant: "destructive",
      })
      return
    }

    startLoading("Criando campanha...")

    try {
      await addDoc(collection(db, "campaigns"), {
        userId: user.uid,
        name,
        description,
        fields,
        lastParticipantNumber: 0,
        winnerNumber: null,
        winnerName: null,
        createdAt: new Date().toISOString(),
        raffleDate: raffleDate ? raffleDate.toISOString() : null,
        termsAccepted,
      })

      toast({
        title: "Campanha criada com sucesso!",
        description: "Sua nova campanha foi criada e está pronta para uso.",
      })

      router.push("/dashboard/campaigns")
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast({
        title: "Erro ao criar campanha",
        description: "Ocorreu um erro ao criar a campanha. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Campanha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createCampaign} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Campanha</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="raffleDate">Data do Sorteio</Label>
              <DatePicker id="raffleDate" selected={raffleDate} onSelect={setRaffleDate} required />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Campos do Formulário</h3>
                <Button type="button" onClick={addField}>
                  Adicionar Campo
                </Button>
              </div>
              {fields.map((field) => (
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                Aceito os{" "}
                <Link href="/terms" className="text-blue-500 hover:underline">
                  termos de uso
                </Link>
                , incluindo as regras sobre autorização de recebimento de mensagens e LGPD
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={!termsAccepted}>
              Criar Campanha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

