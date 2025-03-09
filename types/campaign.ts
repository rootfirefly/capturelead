export interface Campaign {
  id: string
  name: string
  description: string
  createdAt: string // Firestore armazena como timestamp
  raffleDate: string // Firestore armazena como timestamp
  lastParticipantNumber: number
  winnerNumber?: string
  winnerName?: string
}

