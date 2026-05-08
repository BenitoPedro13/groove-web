"use client"

import { Power } from "lucide-react"

import type { LightDevice } from "@/lib/domain/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DeviceCardProps = {
  device: LightDevice
  onTogglePower: (device: LightDevice) => void
  onBoostBrightness: (device: LightDevice) => void
}

export function DeviceCard({ device, onTogglePower, onBoostBrightness }: DeviceCardProps) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-base font-semibold">{device.name}</p>
          <p className="text-xs text-muted-foreground">
            {device.model} {device.ip ? `- ${device.ip}` : ""}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-[11px] font-medium",
            device.online ? "bg-emerald-500/15 text-emerald-600" : "bg-zinc-500/15 text-zinc-500",
          )}
        >
          {device.online ? "Online" : "Offline"}
        </span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <div className="size-6 rounded-full border border-border/60" style={{ backgroundColor: device.color }} />
        <p className="text-sm text-muted-foreground">
          {device.power === "on" ? `${device.brightness}% brilho` : "Desligada"}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant={device.power === "on" ? "default" : "secondary"} onClick={() => onTogglePower(device)}>
          <Power className="mr-1 size-4" />
          {device.power === "on" ? "Desligar" : "Ligar"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onBoostBrightness(device)}>
          +10 brilho
        </Button>
      </div>
    </article>
  )
}
