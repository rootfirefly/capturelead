import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/date-utils"
import type { Campaign } from "@/types/campaign"

interface CampaignOverviewProps {
  campaigns: Campaign[]
}

export function CampaignOverview({ campaigns }: CampaignOverviewProps) {
  if (campaigns.length === 0) {
    return <p>Nenhuma campanha encontrada.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Participantes</TableHead>
          <TableHead>Data do Sorteio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.slice(0, 5).map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell>
              <Badge variant={campaign.winnerNumber ? "secondary" : "default"}>
                {campaign.winnerNumber ? "Encerrada" : "Ativa"}
              </Badge>
            </TableCell>
            <TableCell>{campaign.lastParticipantNumber}</TableCell>
            <TableCell>{formatDate(campaign.raffleDate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

