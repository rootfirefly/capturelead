"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, TrendingUp } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, query, getDocs, where } from "firebase/firestore"
import { FirebaseError } from "firebase/app"
import { CampaignsList } from "@/components/CampaignsList"
import { useLoading } from "@/contexts/loading-context"
import type { Campaign } from "@/types/campaign"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const [showIndexError, setShowIndexError] = useState(false)
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null)
    })
    return () => unsubscribe()
  }, [])

  const {
    data: campaignsData,
    isLoading: isLoadingCampaigns,
    error: campaignsError,
  } = useQuery<Campaign[]>({
    queryKey: ["userCampaigns", userId],
    queryFn: async () => {
      if (!userId) return []

      startLoading("Carregando campanhas...")

      try {
        const campaignsRef = collection(db, "campaigns")
        const q = query(campaignsRef, where("userId", "==", userId))

        const querySnapshot = await getDocs(q)

        const campaigns = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            raffleDate: data.raffleDate?.toDate?.() || new Date(data.raffleDate),
          }
        })

        return campaigns.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      } catch (error) {
        if (error instanceof FirebaseError) {
          if (error.code === "failed-precondition") {
            setShowIndexError(true)
            console.error("Index error:", error)
            throw new Error("Necessário criar índice no Firestore")
          }
        }
        throw error
      } finally {
        stopLoading()
      }
    },
    enabled: !!userId,
  })

  if (isLoadingCampaigns) {
    return null // O preloader global já será exibido
  }

  const totalCampaigns = campaignsData?.length || 0
  const activeCampaigns = campaignsData?.filter((c) => !c.winnerNumber).length || 0

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      {showIndexError && (
        <Alert variant="destructive">
          <AlertTitle>Erro de Índice no Firestore</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>
              É necessário criar um índice composto no Firestore para esta consulta. Por favor, acesse o console do
              Firebase e crie o índice necessário.
            </p>
            <Button variant="outline" onClick={() => window.open("https://console.firebase.google.com", "_blank")}>
              Abrir Console do Firebase <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Campanhas</CardTitle>
        </CardHeader>
        <CardContent>
          {campaignsData && campaignsData.length > 0 ? (
            <CampaignsList campaigns={campaignsData} />
          ) : (
            <p>Você ainda não tem campanhas cadastradas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

