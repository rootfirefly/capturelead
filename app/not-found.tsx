import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">404 - Página Não Encontrada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">Ops! A página que você está procurando não existe ou foi movida.</p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/">Voltar para a Página Inicial</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

