"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileSpreadsheet, Settings, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { MobileMenuExpanded } from "./MobileMenuExpanded"

export function MobileMenu() {
  const pathname = usePathname()

  // Menu items fixos para o menu móvel (sempre 4 itens)
  const menuItems = [
    { icon: LayoutDashboard, label: "Geral", href: "/dashboard" },
    { icon: FileSpreadsheet, label: "Campanhas", href: "/dashboard/campaigns" },
    { icon: MessageSquare, label: "WhatsApp", href: "/dashboard/whatsapp" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <ul className="flex justify-around items-center h-16">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 text-muted-foreground",
                pathname === item.href && "text-primary",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <MobileMenuExpanded />
        </li>
      </ul>
    </nav>
  )
}

