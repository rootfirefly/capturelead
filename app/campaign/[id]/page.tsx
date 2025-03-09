"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, addDoc, runTransaction } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
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

interface Campaign {
  id: string
  name: string
  description: string
  fields: FormField[]
  winnerNumber?: string
  winnerName?: string
}

export default function CampaignForm({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [participantNumber, setParticipantNumber] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    const fetchCampaign = async () => {
      startLoading("Carregando campanha...")

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
        stopLoading()
      }
    }

    fetchCampaign()
  }, [params.id, router, startLoading, stopLoading])

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const getNextParticipantNumber = async (): Promise<string> => {
    const campaignRef = doc(db, "campaigns", params.id)

    try {
      const result = await runTransaction(db, async (transaction) => {
        const campaignDoc = await transaction.get(campaignRef)
        if (!campaignDoc.exists()) {
          throw "Campaign does not exist!"
        }

        const currentLastNumber = campaignDoc.data().lastParticipantNumber || 0
        const nextNumber = currentLastNumber + 1

        transaction.update(campaignRef, { lastParticipantNumber: nextNumber })

        return nextNumber.toString().padStart(2, "0")
      })

      return result
    } catch (error) {
      console.error("Error getting next participant number:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAccepted) {
      toast({
        title: "Termos não aceitos",
        description: "Por favor, aceite os termos para participar da campanha.",
        variant: "destructive",
      })
      return
    }

    startLoading("Enviando formulário...")

    try {
      const nextNumber = await getNextParticipantNumber()

      const docRef = await addDoc(collection(db, "submissions"), {
        campaignId: params.id,
        data: formData,
        participantNumber: nextNumber,
        createdAt: new Date(),
      })

      setParticipantNumber(nextNumber)
      setIsSubmitted(true)
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Obrigado por participar da campanha.",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Erro ao enviar formulário",
        description: "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  if (!campaign) {
    return null // O preloader global já será exibido
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{campaign.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {campaign.winnerNumber ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Campanha Encerrada</h2>
                <p className="mb-4">Esta campanha já foi encerrada e o sorteio foi realizado.</p>
                <h3 className="text-lg font-semibold mb-2">Resultado do Sorteio</h3>
                <p>Número sorteado: {campaign.winnerNumber}</p>
                <p>Nome do vencedor: {campaign.winnerName}</p>
              </div>
            ) : isSubmitted ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Obrigado por participar!</h2>
                <p>Sua inscrição foi registrada com sucesso.</p>
                <p className="mt-2">
                  Seu número de participação é: <strong>{participantNumber}</strong>
                </p>
                <p className="mt-4">
                  Para ver o resultado do sorteio, acesse:
                  <Link href={`/raffle-result/${params.id}`} className="text-blue-500 hover:underline ml-1">
                    Link do Resultado
                  </Link>
                </p>
              </div>
            ) : (
              <div>
                <p className="mb-4">{campaign.description}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {campaign.fields.map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <Input
                        id={field.id}
                        name={field.label}
                        type={field.type}
                        required={field.required}
                        value={formData[field.label] || ""}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      Aceito os{" "}
                      <Link
                        href="/terms"
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        termos de uso
                      </Link>
                      , incluindo as regras sobre autorização de recebimento de mensagens e LGPD
                    </Label>
                  </div>
                  <Button type="submit" disabled={!termsAccepted}>
                    Participar
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

