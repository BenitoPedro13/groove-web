"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { DeviceCard } from "@/components/devices/device-card"
import { useLightStore } from "@/lib/state/use-light-store"

export default function DevicesPage() {
  const { devices, setBrightness, setPower } = useLightStore()
  const { t } = useLanguage()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t.devicesTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.devicesSubtitle}</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
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
    </section>
  )
}
