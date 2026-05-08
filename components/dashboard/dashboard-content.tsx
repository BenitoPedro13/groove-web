"use client"

import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/common/error-state"
import { useLanguage } from "@/components/providers/language-provider"
import { DeviceCard } from "@/components/devices/device-card"
import { useLightStore } from "@/lib/state/use-light-store"
import { useDeviceSync } from "@/hooks/use-device-sync"

export function DashboardContent() {
  const { scenes } = useLightStore()
  const { devices, error, isSyncing, syncLabel, syncDevices, patchDeviceState } = useDeviceSync()
  const { t } = useLanguage()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t.dashboardTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.dashboardSubtitle}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t.lastSync}: {syncLabel}</span>
          <Button size="sm" variant="outline" onClick={() => void syncDevices()}>
            {isSyncing ? t.syncing : t.syncNow}
          </Button>
        </div>
      </header>
      {error ? <ErrorState title={t.connectionErrorTitle} message={error} actionLabel={t.retry} onAction={() => void syncDevices()} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onTogglePower={(current) =>
              void patchDeviceState(current.id, { power: current.power === "on" ? "off" : "on" })
            }
            onChangeBrightnessByStep={(current, delta) =>
              void patchDeviceState(current.id, { brightness: Math.max(0, Math.min(100, current.brightness + delta)) })
            }
            onSetBrightness={(current, value) => void patchDeviceState(current.id, { brightness: value })}
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
