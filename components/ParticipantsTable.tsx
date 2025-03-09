import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Participant } from "@/types/participant"
import { formatDate } from "@/lib/date-utils"

interface ParticipantsTableProps {
  participants: Participant[]
}

export function ParticipantsTable({ participants }: ParticipantsTableProps) {
  // Obter todos os campos únicos de todos os participantes
  const allFields = new Set<string>()
  participants.forEach((participant) => {
    Object.keys(participant.data).forEach((key) => allFields.add(key))
  })
  const fieldArray = Array.from(allFields)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N</TableHead>
          {fieldArray.map((field) => (
            <TableHead key={field}>{field}</TableHead>
          ))}
          <TableHead>Campanha</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.map((participant) => (
          <TableRow key={participant.id}>
            <TableCell>{participant.participantNumber}</TableCell>
            {fieldArray.map((field) => (
              <TableCell key={field}>{participant.data[field] || "-"}</TableCell>
            ))}
            <TableCell>{participant.campaignName}</TableCell>
            <TableCell>{formatDate(participant.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

