import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye } from "lucide-react"
import type { Campaign } from "@/types/campaign"
import { formatDate } from "@/lib/date-utils"
import { EmbedCode } from "./EmbedCode"

interface CampaignsListProps {
  campaigns: Campaign[]
}

export function CampaignsList({ campaigns }: CampaignsListProps) {
  if (campaigns.length === 0) {
    return <p>Você ainda não tem nenhuma campanha. Crie sua primeira campanha agora!</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead>Data do Sorteio</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell>
              <Badge variant={campaign.winnerNumber ? "secondary" : "default"}>
                {campaign.winnerNumber ? "Encerrada" : "Ativa"}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(campaign.createdAt)}</TableCell>
            <TableCell>{formatDate(campaign.raffleDate)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/campaigns/edit/${campaign.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/campaign/${campaign.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Link>
                </Button>
                <EmbedCode campaignId={campaign.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

