"use client"

import { Minus, Plus, Power } from "lucide-react"

import { useLanguage } from "@/components/providers/language-provider"
import type { LightDevice } from "@/lib/domain/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DeviceCardProps = {
  device: LightDevice
  onTogglePower: (device: LightDevice) => void
  onChangeBrightnessByStep: (device: LightDevice, delta: number) => void
  onSetBrightness: (device: LightDevice, value: number) => void
}

export function DeviceCard({ device, onTogglePower, onChangeBrightnessByStep, onSetBrightness }: DeviceCardProps) {
  const { t } = useLanguage()
  const controlsDisabled = !device.online

  return (
    <article className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm" aria-label={device.name}>
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
          {device.online ? t.online : t.offline}
        </span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <div className="size-6 rounded-full border border-border/60" style={{ backgroundColor: device.color }} />
        <p className="text-sm text-muted-foreground">
          {device.power === "on" ? `${device.brightness}% ${t.brightness}` : t.off}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={device.power === "on" ? "default" : "secondary"}
          onClick={() => onTogglePower(device)}
          disabled={controlsDisabled}
        >
          <Power className="mr-1 size-4" />
          {device.power === "on" ? t.turnOff : t.turnOn}
        </Button>
      </div>
      <div className="mt-3 flex items-center gap-2" role="group" aria-label={`${device.name} ${t.brightness}`}>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => onChangeBrightnessByStep(device, -5)}
          aria-label={t.decrease}
          disabled={controlsDisabled}
        >
          <Minus className="size-4" />
        </Button>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={device.brightness}
          onChange={(event) => onSetBrightness(device, Number(event.target.value))}
          className="h-2 w-full cursor-pointer accent-primary"
          aria-label={t.brightness}
          disabled={controlsDisabled}
        />
        <Button
          size="icon"
          variant="secondary"
          onClick={() => onChangeBrightnessByStep(device, 5)}
          aria-label={t.increase}
          disabled={controlsDisabled}
        >
          <Plus className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onSetBrightness(device, device.brightness)}
          disabled={controlsDisabled}
        >
          {device.brightness}%
        </Button>
      </div>
    </article>
  )
}
