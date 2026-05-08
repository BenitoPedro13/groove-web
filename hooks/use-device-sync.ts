"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { DevicePower } from "@/lib/domain/types"
import { useLightStore } from "@/lib/state/use-light-store"

type DeviceStatePatch = {
  power?: DevicePower
  brightness?: number
  color?: string
}

type DeviceApiResponse = {
  data?: ReturnType<typeof useLightStore.getState>["devices"]
  error?: string
}

export function useDeviceSync() {
  const { devices, setDevices } = useLightStore()
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)

  const syncDevices = useCallback(async () => {
    setIsSyncing(true)
    try {
      const response = await fetch("/api/devices", { cache: "no-store" })
      const payload = (await response.json()) as DeviceApiResponse
      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Failed to sync devices.")
      }
      setDevices(payload.data)
      setLastSyncedAt(new Date())
      setError(null)
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Failed to sync devices.")
    } finally {
      setIsSyncing(false)
    }
  }, [setDevices])

  const patchDeviceState = useCallback(
    async (id: string, patch: DeviceStatePatch) => {
      const response = await fetch(`/api/devices/${id}/state`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })

      const payload = (await response.json()) as { data?: (typeof devices)[number]; error?: string }
      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Failed to update device.")
      }

      setDevices((current) => current.map((device) => (device.id === id ? payload.data! : device)))
      setError(null)
      setLastSyncedAt(new Date())
    },
    [setDevices],
  )

  useEffect(() => {
    const initialSync = window.setTimeout(() => {
      void syncDevices()
    }, 0)
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void syncDevices()
      }
    }, 15000)
    return () => {
      window.clearTimeout(initialSync)
      window.clearInterval(interval)
    }
  }, [syncDevices])

  const syncLabel = useMemo(() => {
    if (!lastSyncedAt) return "-"
    return lastSyncedAt.toLocaleTimeString()
  }, [lastSyncedAt])

  return {
    devices,
    error,
    isSyncing,
    lastSyncedAt,
    syncLabel,
    syncDevices,
    patchDeviceState,
  }
}
