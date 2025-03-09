"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface EmbedCodeProps {
  campaignId: string
}

export function EmbedCode({ campaignId }: EmbedCodeProps) {
  const [isCopied, setIsCopied] = useState(false)

  const embedCode = `<iframe src="${process.env.NEXT_PUBLIC_BASE_URL}/campaign/${campaignId}" width="100%" height="500" frameborder="0"></iframe>`

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(embedCode)
      .then(() => {
        setIsCopied(true)
        toast({
          title: "Código copiado!",
          description: "O código de incorporação foi copiado para a área de transferência.",
        })
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Falha ao copiar texto: ", err)
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o código. Por favor, tente novamente.",
          variant: "destructive",
        })
      })
  }

  return (
    <Button onClick={copyToClipboard} variant="outline">
      {isCopied ? "Copiado!" : "Copiar Código de Incorporação"}
    </Button>
  )
}

