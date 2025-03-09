"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Participant } from "@/types/participant"
import { formatDate } from "@/lib/date-utils"

interface CampaignParticipantsProps {
  participants: Participant[]
}

export function CampaignParticipants({ participants }: CampaignParticipantsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  return (
    <div>
      <Button onClick={toggleExpand} variant="outline" size="sm" className="mb-2">
        {isExpanded ? (
          <>
            <ChevronUp className="mr-2 h-4 w-4" /> Ocultar Participantes
          </>
        ) : (
          <>
            <ChevronDown className="mr-2 h-4 w-4" /> Mostrar Participantes ({participants.length})
          </>
        )}
      </Button>
      {isExpanded && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Data de Participação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.participantNumber}</TableCell>
                <TableCell>{participant.data.name}</TableCell>
                <TableCell>{participant.data.email}</TableCell>
                <TableCell>{participant.data.whatsapp}</TableCell>
                <TableCell>{formatDate(participant.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

