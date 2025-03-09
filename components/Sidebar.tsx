"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  LogOut,
  MessageSquare,
  Settings2,
  Users,
  Smartphone,
  MessageCircle,
} from "lucide-react"
import { useAdmin } from "@/hooks/useAdmin"

export function DashboardSidebar() {
  const router = useRouter()
  const { isAdmin } = useAdmin()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Geral", href: "/dashboard" },
    { icon: FileSpreadsheet, label: "Campanhas", href: "/dashboard/campaigns" },
    { icon: MessageSquare, label: "WhatsApp", href: "/dashboard/whatsapp" },
    { icon: MessageCircle, label: "Chat WhatsApp", href: "/dashboard/whatsapp/chat" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
  ]

  // Adicionar itens de menu de administração apenas para admins
  if (isAdmin) {
    menuItems.push(
      { icon: Settings2, label: "Config. API", href: "/dashboard/admin/api-config" },
      { icon: Users, label: "Usuários", href: "/dashboard/admin/users" },
      { icon: Smartphone, label: "Instâncias", href: "/dashboard/admin/instances" },
    )
  }

  return (
    <Sidebar className="hidden md:flex w-64 border-r h-full">
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold">CaptaLeadQR</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild>
                <Link href={item.href} className="flex items-center gap-2 px-4 py-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 w-full">
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

