"use client"

import { useLanguage } from "@/components/providers/language-provider"

export default function SettingsPage() {
  const { t } = useLanguage()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t.settingsTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.settingsSubtitle}</p>
      </header>
      <div className="rounded-2xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
        {t.settingsNextStep}
      </div>
    </section>
  )
}
