"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
// Adicione o import do ícone Database
import {
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  LogOut,
  MessageSquare,
  Settings2,
  Users,
  Smartphone,
  Menu,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAdmin } from "@/hooks/useAdmin"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function MobileMenuExpanded() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin } = useAdmin()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setOpen(false)
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  // Modifique o array menuItems para incluir o link para sincronização
  const menuItems = [
    { icon: LayoutDashboard, label: "Geral", href: "/dashboard" },
    { icon: FileSpreadsheet, label: "Campanhas", href: "/dashboard/campaigns" },
    { icon: MessageSquare, label: "WhatsApp", href: "/dashboard/whatsapp" },
    { icon: MessageCircle, label: "Chat WhatsApp", href: "/dashboard/whatsapp/chat" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
  ]

  // Modificar a parte onde adicionamos os itens de menu para administradores
  // Adicionar item de menu de configuração da API apenas para admins
  if (isAdmin) {
    menuItems.push(
      { icon: Settings2, label: "Config. API", href: "/dashboard/admin/api-config" },
      { icon: Users, label: "Usuários", href: "/dashboard/admin/users" },
      { icon: Smartphone, label: "Instâncias", href: "/dashboard/admin/instances" },
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden flex flex-col items-center p-2 text-muted-foreground">
          <Menu className="h-5 w-5" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-md hover:bg-muted",
                      pathname === item.href && "bg-muted font-medium",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto pt-4 border-t">
            <Button
              variant="destructive"
              className="w-full flex items-center gap-2 justify-center"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

