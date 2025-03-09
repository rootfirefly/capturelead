"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { Campaign } from "@/types/campaign"

interface CampaignChartProps {
  campaigns: Campaign[]
}

export function CampaignChart({ campaigns }: CampaignChartProps) {
  if (campaigns.length === 0) {
    return <p>Nenhuma campanha disponível para exibir no gráfico.</p>
  }

  const data = campaigns.map((campaign) => ({
    name: campaign.name,
    total: campaign.lastParticipantNumber,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

