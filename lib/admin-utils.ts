import { db } from "./firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"

/**
 * Promove um usuário para o papel de administrador
 * Esta função deve ser usada apenas pelo desenvolvedor para configurar o primeiro admin
 * @param userId ID do usuário a ser promovido
 */
export async function promoteToAdmin(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      console.error("Usuário não encontrado")
      return false
    }

    await updateDoc(userRef, {
      role: "admin",
    })

    console.log(`Usuário ${userId} promovido a administrador com sucesso`)
    return true
  } catch (error) {
    console.error("Erro ao promover usuário a administrador:", error)
    return false
  }
}

