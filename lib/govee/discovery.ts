import type { LightDevice } from "@/lib/domain/types"
import { mockDevices } from "@/lib/mocks/devices"

export type DiscoveryOptions = {
  timeoutMs?: number
}

export async function discoverDevices(options?: DiscoveryOptions): Promise<LightDevice[]> {
  const timeout = options?.timeoutMs ?? 100
  // Placeholder: in production this should execute LAN discovery with UDP broadcast.
  await new Promise((resolve) => setTimeout(resolve, timeout))
  return mockDevices
}
