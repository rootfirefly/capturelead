"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "./useAuth"

export function useAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true)

      if (!user) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setIsAdmin(userData.role === "admin")
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Erro ao verificar status de admin:", error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [user])

  return { isAdmin, isLoading }
}

