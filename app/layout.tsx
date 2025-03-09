import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { LoadingProvider } from "@/contexts/loading-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sistema de Captura de Leads",
  description: "Gerencie suas campanhas e capture leads de forma eficiente",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <LoadingProvider>{children}</LoadingProvider>
      </body>
    </html>
  )
}



import './globals.css'