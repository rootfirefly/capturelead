import { Preloader } from "@/components/ui/preloader"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Preloader size="lg" text="Carregando..." />
    </div>
  )
}

