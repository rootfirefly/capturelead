import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserData } from "@/types/user"

interface UserProfileProps {
  user: UserData
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user.photoURL || undefined} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-sm text-muted-foreground">WhatsApp: {user.whatsapp}</p>
        {user.isCompany && (
          <p className="text-sm text-muted-foreground">
            {user.companyName} - CNPJ: {user.cnpj}
          </p>
        )}
      </div>
    </div>
  )
}

