"use client"

import { FormEvent, useState } from "react"

import { ErrorState } from "@/components/common/error-state"
import { useLanguage } from "@/components/providers/language-provider"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const { t } = useLanguage()
  const [ip, setIp] = useState("")
  const [name, setName] = useState("")
  const [model, setModel] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, name, model }),
      })
      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to add manual device.")
      }

      setSuccess(t.manualDeviceAdded)
      setIp("")
      setName("")
      setModel("")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to add manual device.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t.settingsTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.settingsSubtitle}</p>
      </header>
      <div className="rounded-2xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
        {t.settingsNextStep}
      </div>
      <section className="rounded-2xl border border-border/60 bg-card p-4">
        <h2 className="text-base font-semibold">{t.manualIpTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.manualIpDescription}</p>
        <form className="mt-4 space-y-3" onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground" htmlFor="manual-ip">
              {t.ipAddress}
            </label>
            <input
              id="manual-ip"
              required
              value={ip}
              onChange={(event) => setIp(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              placeholder="192.168.0.10"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="manual-name">
                {t.deviceName}
              </label>
              <input
                id="manual-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                placeholder="Desk Strip"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="manual-model">
                {t.deviceModel}
              </label>
              <input
                id="manual-model"
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                placeholder="H61XX"
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.syncing : t.addDevice}
          </Button>
        </form>
        {error ? <div className="mt-3"><ErrorState title={t.connectionErrorTitle} message={error} /></div> : null}
        {success ? <p className="mt-3 text-sm text-emerald-600">{success}</p> : null}
      </section>
    </section>
  )
}
