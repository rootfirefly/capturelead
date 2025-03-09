"use client"

import { useState, useEffect } from "react"
import { auth } from "../lib/firebase"
import { onAuthStateChanged, type User } from "firebase/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("useAuth: Configurando listener de autenticação")

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "useAuth: Estado de autenticação alterado:",
        user ? `Usuário logado: ${user.email}` : "Nenhum usuário",
      )
      setUser(user)
      setLoading(false)
    })

    return () => {
      console.log("useAuth: Removendo listener de autenticação")
      unsubscribe()
    }
  }, [])

  return { user, loading }
}

