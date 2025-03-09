"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { AdminGuard } from "@/components/AdminGuard"
import { useLoading } from "@/contexts/loading-context"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  whatsapp: string
  role: "admin" | "client"
  createdAt: any
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    startLoading("Carregando usuários...")

    try {
      const querySnapshot = await getDocs(collection(db, "users"))
      const fetchedUsers: User[] = []

      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() } as User)
      })

      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  const toggleUserRole = async (userId: string, currentRole: "admin" | "client") => {
    const newRole = currentRole === "admin" ? "client" : "admin"

    startLoading(`${newRole === "admin" ? "Promovendo" : "Rebaixando"} usuário...`)

    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      })

      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      toast({
        title: "Papel atualizado",
        description: `Usuário ${newRole === "admin" ? "promovido a administrador" : "definido como cliente"} com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao atualizar papel do usuário:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o papel do usuário.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  return (
    <AdminGuard>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.whatsapp}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? "Administrador" : "Cliente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" onClick={() => toggleUserRole(user.id, user.role)}>
                        {user.role === "admin" ? "Rebaixar para Cliente" : "Promover a Admin"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  )
}

