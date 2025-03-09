interface FirestoreTimestamp {
  seconds: number
  nanoseconds: number
}

export interface Participant {
  id: string
  campaignId: string
  campaignName: string
  participantNumber: string
  data: {
    nome: string
    email: string
    whatsapp: string
  }
  createdAt: Date | FirestoreTimestamp
}

