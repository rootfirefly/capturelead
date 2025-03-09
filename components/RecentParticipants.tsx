import { formatDate } from "@/lib/date-utils"
import type { Participant } from "@/types/participant"

interface RecentParticipantsProps {
  participants: Participant[]
}

export function RecentParticipants({ participants }: RecentParticipantsProps) {
  if (participants.length === 0) {
    return <p>Nenhum participante recente.</p>
  }

  return (
    <div className="space-y-8">
      {participants.map((participant) => (
        <div key={participant.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{participant.data.name}</p>
            <p className="text-sm text-muted-foreground">
              {participant.campaignName} - {formatDate(participant.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

