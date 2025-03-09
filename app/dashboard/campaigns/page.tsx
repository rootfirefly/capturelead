"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { db, auth } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, LinkIcon, Gift, Edit, Trash2, Share2, QrCode, Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { QRCodeSVG } from "qrcode.react"
import { ParticipantsList } from "@/components/ParticipantsList"
import { formatDate } from "@/lib/date-utils"
import { useLoading } from "@/contexts/loading-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Campaign {
  id: string
  name: string
  description: string
  winnerNumber?: string
  raffleDate: any // Using 'any' here as we're not sure of the exact type from Firestore
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const router = useRouter()
  const { startLoading, stopLoading } = useLoading()

  const fetchCampaigns = async () => {
    const user = auth.currentUser
    if (!user) return

    startLoading("Carregando campanhas...")

    try {
      const q = query(collection(db, "campaigns"), where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)
      const fetchedCampaigns: Campaign[] = []
      querySnapshot.forEach((doc) => {
        fetchedCampaigns.push({ id: doc.id, ...doc.data() } as Campaign)
      })
      setCampaigns(fetchedCampaigns)
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas campanhas.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [auth.currentUser])

  const handleDelete = async (id: string) => {
    startLoading("Excluindo campanha...")

    try {
      await deleteDoc(doc(db, "campaigns", id))
      toast({
        title: "Campanha excluída com sucesso",
        description: "A campanha foi removida permanentemente.",
      })
      fetchCampaigns()
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast({
        title: "Erro ao excluir campanha",
        description: "Ocorreu um erro ao tentar excluir a campanha. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  const copyFormLink = (id: string) => {
    const link = `${window.location.origin}/campaign/${id}`
    navigator.clipboard.writeText(link).then(
      () => {
        toast({
          title: "Link copiado!",
          description: "O link do formulário foi copiado para a área de transferência.",
        })
      },
      (err) => {
        console.error("Erro ao copiar link: ", err)
        toast({
          title: "Erro ao copiar link",
          description: "Não foi possível copiar o link. Por favor, tente novamente.",
          variant: "destructive",
        })
      },
    )
  }

  const downloadQRCode = (id: string) => {
    const link = `${window.location.origin}/campaign/${id}`
    const svg = document.getElementById(`qr-code-${id}`) as SVGSVGElement
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `qrcode-campaign-${id}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suas Campanhas</h1>
        <Button asChild>
          <Link href="/dashboard/campaigns/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Nova Campanha
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <p>Você ainda não tem nenhuma campanha. Crie sua primeira campanha agora!</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/campaigns/create">
                <PlusCircle className="mr-2 h-4 w-4" /> Criar Nova Campanha
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{campaign.name}</CardTitle>
                  <ParticipantsList campaignId={campaign.id} />
                </div>
                <p className={`text-sm ${campaign.winnerNumber ? "text-red-500" : "text-green-500"}`}>
                  {campaign.winnerNumber ? "Sorteio Realizado" : "Ativa"}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{campaign.description}</p>
                <div className="flex items-center mb-4">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-700">Sorteio: {formatDate(campaign.raffleDate)}</p>
                </div>
                <div className="space-y-2">
                  <Button onClick={() => copyFormLink(campaign.id)} variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" /> Compartilhar Formulário
                  </Button>
                  <Button onClick={() => downloadQRCode(campaign.id)} variant="outline" className="w-full">
                    <QrCode className="mr-2 h-4 w-4" /> Baixar QR Code
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/campaign/${campaign.id}`}>
                      <LinkIcon className="mr-2 h-4 w-4" /> Formulário da Campanha
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/raffle/${campaign.id}`}>
                      <Gift className="mr-2 h-4 w-4" /> Sorteador da Campanha
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/dashboard/campaigns/edit/${campaign.id}`}>
                      <Edit className="mr-2 h-4 w-4" /> Editar Campanha
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir Campanha
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente a campanha e todos os dados
                          associados a ela.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(campaign.id)}>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <div className="hidden">
                    <QRCodeSVG
                      id={`qr-code-${campaign.id}`}
                      value={`${window.location.origin}/campaign/${campaign.id}`}
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

