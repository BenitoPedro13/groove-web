import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

type ErrorStateProps = {
  title?: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function ErrorState({ title = "Algo deu errado", message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className="size-4" />
        <p className="font-medium">{title}</p>
      </div>
      <p className="text-sm">{message}</p>
      {actionLabel && onAction ? (
        <Button className="mt-3" size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
