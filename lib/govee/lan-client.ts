import type { DevicePower, LightDevice } from "@/lib/domain/types"

import { discoverDevices } from "@/lib/govee/discovery"

type DevicePatch = {
  power?: DevicePower
  brightness?: number
  color?: string
}

const inMemoryStates = new Map<string, Pick<LightDevice, "power" | "brightness" | "color">>()

export class GoveeLanClient {
  async listDevices(): Promise<LightDevice[]> {
    const discovered = await discoverDevices()
    return discovered.map((device) => ({
      ...device,
      ...inMemoryStates.get(device.id),
    }))
  }

  async updateDeviceState(deviceId: string, patch: DevicePatch): Promise<LightDevice | null> {
    const devices = await this.listDevices()
    const found = devices.find((device) => device.id === deviceId)
    if (!found) return null

    const nextState = {
      power: patch.power ?? found.power,
      brightness: patch.brightness ?? found.brightness,
      color: patch.color ?? found.color,
    }

    inMemoryStates.set(deviceId, nextState)

    return {
      ...found,
      ...nextState,
    }
  }
}

export const goveeLanClient = new GoveeLanClient()

export function resetLanClientState() {
  inMemoryStates.clear()
}
