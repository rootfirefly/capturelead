import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Check, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/lib/whatsapp-message-service"

interface ChatMessageProps {
  message: ChatMessage
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
    locale: ptBR,
  })

  const getStatusIcon = () => {
    if (!message.fromMe) return null

    switch (message.status?.toUpperCase()) {
      case "DELIVERED":
        return <Check className="h-4 w-4 text-blue-500" />
      case "READ":
        return <CheckCheck className="h-4 w-4 text-blue-500" />
      default:
        return <Check className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col max-w-[70%] rounded-lg p-3 mb-2",
        message.fromMe
          ? "bg-primary text-primary-foreground self-end rounded-br-none"
          : "bg-muted self-start rounded-bl-none",
      )}
    >
      <p className="whitespace-pre-wrap break-words">{message.text}</p>
      <div className="flex items-center justify-end gap-1 mt-1">
        <span className="text-xs opacity-70">{formattedTime}</span>
        {getStatusIcon()}
      </div>
    </div>
  )
}

