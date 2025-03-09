"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, query, where, getDocs, runTransaction } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Participant {
  id: string
  participantNumber: string
  data: {
    [key: string]: string
  }
}

interface Campaign {
  id: string
  name: string
  winnerNumber?: string
  winnerName?: string
}

export default function Raffle({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCampaignAndParticipants = async () => {
      try {
        const campaignDoc = await getDoc(doc(db, "campaigns", params.id))
        if (campaignDoc.exists()) {
          setCampaign({ id: campaignDoc.id, ...campaignDoc.data() } as Campaign)
        } else {
          router.push("/404")
          return
        }

        const participantsQuery = query(collection(db, "submissions"), where("campaignId", "==", params.id))
        const participantsSnapshot = await getDocs(participantsQuery)
        const participantsData: Participant[] = []
        participantsSnapshot.forEach((doc) => {
          participantsData.push({ id: doc.id, ...doc.data() } as Participant)
        })
        setParticipants(participantsData)
      } catch (error) {
        console.error("Error fetching campaign and participants:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os detalhes da campanha e participantes.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaignAndParticipants()
  }, [params.id, router])

  const performRaffle = async () => {
    if (participants.length === 0) {
      toast({
        title: "Não é possível realizar o sorteio",
        description: "Não há participantes na campanha.",
        variant: "destructive",
      })
      return
    }

    const winnerIndex = Math.floor(Math.random() * participants.length)
    const winner = participants[winnerIndex]

    try {
      await runTransaction(db, async (transaction) => {
        const campaignRef = doc(db, "campaigns", params.id)
        const campaignDoc = await transaction.get(campaignRef)

        if (!campaignDoc.exists()) {
          throw "Campaign does not exist!"
        }

        if (campaignDoc.data().winnerNumber) {
          throw "Raffle has already been performed!"
        }

        transaction.update(campaignRef, {
          winnerNumber: winner.participantNumber,
          winnerName: winner.data.name || "Participante " + winner.participantNumber,
        })
      })

      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              winnerNumber: winner.participantNumber,
              winnerName: winner.data.name || "Participante " + winner.participantNumber,
            }
          : null,
      )

      toast({
        title: "Sorteio realizado com sucesso!",
        description: `O vencedor é o participante número ${winner.participantNumber}.`,
      })
    } catch (error) {
      console.error("Error performing raffle:", error)
      toast({
        title: "Erro ao realizar o sorteio",
        description: "Ocorreu um erro ao realizar o sorteio. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Campanha não encontrada.</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sorteio - {campaign.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Total de participantes: {participants.length}</p>
            {campaign.winnerNumber ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">Resultado do Sorteio</h3>
                <p>Número sorteado: {campaign.winnerNumber}</p>
                <p>Nome do vencedor: {campaign.winnerName}</p>
              </div>
            ) : (
              <div>
                <p className="mb-4">O sorteio ainda não foi realizado.</p>
                <Button onClick={performRaffle} disabled={participants.length === 0}>
                  Realizar Sorteio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

