import { AlertTriangle } from "lucide-react"

type ErrorStateProps = {
  title?: string
  message: string
}

export function ErrorState({ title = "Algo deu errado", message }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className="size-4" />
        <p className="font-medium">{title}</p>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}
