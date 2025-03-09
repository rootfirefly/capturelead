export interface UserData {
  id: string
  name: string
  email: string
  whatsapp: string
  photoURL?: string
  isCompany: boolean
  companyName?: string
  cnpj?: string
  role: "admin" | "client"
}

