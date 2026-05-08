"use client"

import { useEffect, useState } from "react"

type SystemStatus = {
  adapterEnabled: boolean
  transportMode: "mock" | "udp"
  discoveryMode: "mock" | "udp"
  debugEnabled: boolean
}

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      const response = await fetch("/api/system/status", { cache: "no-store" })
      const payload = (await response.json()) as { data?: SystemStatus }
      if (active && payload.data) {
        setStatus(payload.data)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [])

  return status
}
