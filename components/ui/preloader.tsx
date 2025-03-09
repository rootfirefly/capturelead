import { cn } from "@/lib/utils"

interface PreloaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
  text?: string
}

export function Preloader({ className, size = "md", fullScreen = false, text }: PreloaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin",
          sizeClasses[size],
        )}
      />
      {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

