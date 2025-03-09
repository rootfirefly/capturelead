"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WhatsAppInstance {
  id: string
  instanceName: string
  status: string
}

interface InstanceSelectorProps {
  instances: WhatsAppInstance[]
  selectedInstance: string | null
  onSelectInstance: (instanceName: string) => void
}

export function InstanceSelector({ instances, selectedInstance, onSelectInstance }: InstanceSelectorProps) {
  return (
    <div className="w-full max-w-xs mb-4">
      <Select value={selectedInstance || ""} onValueChange={onSelectInstance}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma instância" />
        </SelectTrigger>
        <SelectContent>
          {instances.map((instance) => (
            <SelectItem key={instance.id} value={instance.instanceName}>
              {instance.instanceName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

