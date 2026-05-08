import type { LightDevice } from "@/lib/domain/types"
import {
  getLanDiscoveryBroadcastAddress,
  getLanDiscoveryMode,
  getLanDiscoveryPort,
  getLanDiscoveryTimeoutMs,
} from "@/lib/govee/config"
import { goveeDebug, goveeWarn } from "@/lib/govee/logger"
import { mockDevices } from "@/lib/mocks/devices"
import { discoverViaUdp } from "@/lib/govee/transport/discovery-udp"

export type DiscoveryOptions = {
  timeoutMs?: number
}

export async function discoverDevices(options?: DiscoveryOptions): Promise<LightDevice[]> {
  const mode = getLanDiscoveryMode()
  goveeDebug("Starting device discovery", { mode })
  if (mode === "mock") {
    const timeout = options?.timeoutMs ?? 100
    await new Promise((resolve) => setTimeout(resolve, timeout))
    goveeDebug("Returning mock devices from discovery", { count: mockDevices.length })
    return mockDevices
  }

  try {
    const devices = await discoverViaUdp({
      port: getLanDiscoveryPort(),
      broadcastAddress: getLanDiscoveryBroadcastAddress(),
      timeoutMs: options?.timeoutMs ?? getLanDiscoveryTimeoutMs(),
    })

    if (devices.length > 0) {
      goveeDebug("UDP discovery succeeded", { count: devices.length })
      return devices
    }
    goveeWarn("UDP discovery returned zero devices, falling back to mock")
  } catch {
    goveeWarn("UDP discovery failed, falling back to mock")
  }

  return mockDevices
}
