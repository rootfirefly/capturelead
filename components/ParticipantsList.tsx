"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Participant {
  id: string
  participantNumber: string
  data: {
    [key: string]: string
  }
}

export function ParticipantsList({ campaignId }: { campaignId: string }) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true)
      const q = query(collection(db, "submissions"), where("campaignId", "==", campaignId))
      const querySnapshot = await getDocs(q)
      const fetchedParticipants: Participant[] = []
      querySnapshot.forEach((doc) => {
        fetchedParticipants.push({ id: doc.id, ...doc.data() } as Participant)
      })
      setParticipants(fetchedParticipants)
      setIsLoading(false)
    }

    fetchParticipants()
  }, [campaignId])

  const downloadCSV = () => {
    if (participants.length === 0) return

    const headers = ["Número", ...Object.keys(participants[0].data)]
    const csvContent = [
      headers.join(","),
      ...participants.map((p) => [p.participantNumber, ...Object.values(p.data)].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `participants_${campaignId}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Participantes da Campanha</DialogTitle>
          <DialogDescription>Lista de todos os participantes desta campanha.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mb-4">
          <Button onClick={downloadCSV} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {isLoading ? (
            <p>Carregando participantes...</p>
          ) : participants.length === 0 ? (
            <p>Nenhum participante encontrado para esta campanha.</p>
          ) : (
            <ul className="space-y-4">
              {participants.map((participant) => (
                <li key={participant.id} className="border-b pb-2">
                  <p className="font-semibold">Número: {participant.participantNumber}</p>
                  {Object.entries(participant.data).map(([key, value]) => (
                    <p key={key}>
                      {key}: {value}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

