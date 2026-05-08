"use client"

import { DeviceCard } from "@/components/devices/device-card"
import { useLightStore } from "@/lib/state/use-light-store"

export default function DevicesPage() {
  const { devices, setBrightness, setPower } = useLightStore()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Devices</h1>
        <p className="text-sm text-muted-foreground">Gerencie estado, brilho e disponibilidade dos dispositivos RGBIC.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onTogglePower={(current) => setPower(current.id, current.power === "on" ? "off" : "on")}
            onBoostBrightness={(current) => setBrightness(current.id, current.brightness + 10)}
          />
        ))}
      </div>
    </section>
  )
}
