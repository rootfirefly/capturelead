"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Campaign {
  id: string
  name: string
  winnerNumber?: string
  winnerName?: string
}

export default function RaffleResult({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [participantCount, setParticipantCount] = useState<number>(0)
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
        setParticipantCount(participantsSnapshot.size)
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

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!campaign) {
    return <div>Campanha não encontrada.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultado do Sorteio - {campaign.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Total de participantes: {participantCount}</p>
        {campaign.winnerNumber ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">Resultado do Sorteio</h3>
            <p>Número sorteado: {campaign.winnerNumber}</p>
            <p>Nome do vencedor: {campaign.winnerName}</p>
          </div>
        ) : (
          <p>O sorteio ainda não foi realizado. Por favor, verifique novamente mais tarde.</p>
        )}
      </CardContent>
    </Card>
  )
}

