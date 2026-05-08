"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { DeviceCard } from "@/components/devices/device-card"
import { useLightStore } from "@/lib/state/use-light-store"

export function DashboardContent() {
  const { devices, scenes, setBrightness, setPower } = useLightStore()
  const { t } = useLanguage()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t.dashboardTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.dashboardSubtitle}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onTogglePower={(current) => setPower(current.id, current.power === "on" ? "off" : "on")}
            onChangeBrightnessByStep={(current, delta) => setBrightness(current.id, current.brightness + delta)}
            onSetBrightness={(current, value) => setBrightness(current.id, value)}
          />
        ))}
      </div>
      <section className="rounded-2xl border border-border/70 bg-card p-4">
        <p className="mb-3 text-sm font-medium">{t.scenesLabel}</p>
        <div className="flex flex-wrap gap-2">
          {scenes.map((scene) => (
            <span key={scene.id} className="rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              {scene.name}
            </span>
          ))}
        </div>
      </section>
    </section>
  )
}
