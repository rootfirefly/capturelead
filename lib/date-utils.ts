import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface FirestoreTimestamp {
  seconds: number
  nanoseconds: number
}

export function ensureDate(date: Date | FirestoreTimestamp | string | number | undefined): Date | undefined {
  if (date === undefined) return undefined
  if (date instanceof Date) return date
  if (typeof date === "object" && "seconds" in date && "nanoseconds" in date) {
    return new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
  }
  if (typeof date === "string" || typeof date === "number") {
    const parsedDate = new Date(date)
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate
  }
  return undefined
}

export function formatDate(date: Date | FirestoreTimestamp | string | number | undefined): string {
  const validDate = ensureDate(date)
  return validDate ? format(validDate, "dd/MM", { locale: ptBR }) : "Data inválida"
}

