"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { useSystemStatus } from "@/hooks/use-system-status"

export function SystemModeBadge() {
  const { t } = useLanguage()
  const status = useSystemStatus()

  if (!status) return null

  return (
    <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
      <p className="font-medium text-foreground">{t.systemMode}</p>
      <p>
        {t.adapter}: {status.adapterEnabled ? t.on : t.offState} | {t.transport}: {status.transportMode} | {t.discovery}:{" "}
        {status.discoveryMode} | {t.debug}: {status.debugEnabled ? t.on : t.offState}
      </p>
    </div>
  )
}
