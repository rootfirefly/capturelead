"use client"

import type React from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"
import { DashboardSidebar } from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { MobileMenu } from "@/components/MobileMenu"
import { AuthGuard } from "@/components/AuthGuard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 overflow-auto">
              <main className="w-full h-full p-4 pb-20 md:pb-4">{children}</main>
              <MobileMenu />
            </div>
          </div>
        </SidebarProvider>
      </AuthGuard>
    </QueryClientProvider>
  )
}

