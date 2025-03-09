import type { Campaign } from "@/types/campaign"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/date-utils"

interface CampaignsTableProps {
  campaigns: Campaign[]
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Participantes</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead>Data do Sorteio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell>{campaign.name}</TableCell>
            <TableCell>
              <Badge variant={campaign.winnerNumber ? "secondary" : "default"}>
                {campaign.winnerNumber ? "Encerrada" : "Ativa"}
              </Badge>
            </TableCell>
            <TableCell>{campaign.lastParticipantNumber}</TableCell>
            <TableCell>{formatDate(campaign.createdAt)}</TableCell>
            <TableCell>{formatDate(campaign.raffleDate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

