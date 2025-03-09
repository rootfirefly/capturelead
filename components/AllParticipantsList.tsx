import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Participant } from "@/types/participant"
import { formatDate } from "@/lib/date-utils"

interface AllParticipantsListProps {
  participants: Participant[]
}

export function AllParticipantsList({ participants }: AllParticipantsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>WhatsApp</TableHead>
          <TableHead>Campanha</TableHead>
          <TableHead>Data de Participação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.map((participant) => (
          <TableRow key={participant.id}>
            <TableCell>{participant.data.nome}</TableCell>
            <TableCell>{participant.data.email}</TableCell>
            <TableCell>{participant.data.whatsapp}</TableCell>
            <TableCell>{participant.campaignName}</TableCell>
            <TableCell>{formatDate(participant.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

