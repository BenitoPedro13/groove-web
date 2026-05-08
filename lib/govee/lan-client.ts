import type { DevicePower, LightDevice } from "@/lib/domain/types"

import { resolveAdapter } from "@/lib/govee/adapters/registry"
import type { DeviceStatePatch } from "@/lib/govee/adapters/types"
import { isLanAdapterEnabled } from "@/lib/govee/config"
import { discoverDevices } from "@/lib/govee/discovery"
import { goveeDebug, goveeWarn } from "@/lib/govee/logger"

const inMemoryStates = new Map<string, Pick<LightDevice, "power" | "brightness" | "color">>()
const manualDevices = new Map<string, LightDevice>()

export class GoveeLanClient {
  async listDevices(): Promise<LightDevice[]> {
    const discovered = await discoverDevices()
    const merged = [...discovered]

    for (const manual of manualDevices.values()) {
      const exists = merged.some((device) => device.ip === manual.ip)
      if (!exists) merged.push(manual)
    }

    const result = merged.map((device) => ({
      ...device,
      ...inMemoryStates.get(device.id),
    }))
    goveeDebug("Listing devices from LAN client", { count: result.length })
    return result
  }

  async updateDeviceState(deviceId: string, patch: DeviceStatePatch): Promise<LightDevice | null> {
    const devices = await this.listDevices()
    const found = devices.find((device) => device.id === deviceId)
    if (!found) return null

    let nextState: {
      power: DevicePower
      brightness: number
      color: string
    }

    if (isLanAdapterEnabled()) {
      const adapter = resolveAdapter(found.model)
      if (adapter) {
        try {
          nextState = await adapter.applyState(found, patch)
        } catch {
          goveeWarn("Adapter applyState failed, using in-memory fallback", {
            deviceId: found.id,
            model: found.model,
            adapterId: adapter.id,
          })
          nextState = {
            power: patch.power ?? found.power,
            brightness: patch.brightness ?? found.brightness,
            color: patch.color ?? found.color,
          }
        }
      } else {
        goveeWarn("No adapter resolved for model, using in-memory fallback", {
          deviceId: found.id,
          model: found.model,
        })
        nextState = {
          power: patch.power ?? found.power,
          brightness: patch.brightness ?? found.brightness,
          color: patch.color ?? found.color,
        }
      }
    } else {
      nextState = {
        power: patch.power ?? found.power,
        brightness: patch.brightness ?? found.brightness,
        color: patch.color ?? found.color,
      }
    }

    inMemoryStates.set(deviceId, nextState)
    goveeDebug("Device state updated", { deviceId, nextState })

    return {
      ...found,
      ...nextState,
    }
  }

  registerManualDevice(ip: string, name = "Manual Device", model = "Unknown"): LightDevice {
    const existing = [...manualDevices.values()].find((device) => device.ip === ip)
    if (existing) return existing

    const device: LightDevice = {
      id: `manual-${ip.replaceAll(".", "-")}`,
      name,
      model,
      ip,
      online: true,
      power: "off",
      brightness: 50,
      color: "#ffffff",
      segments: [{ id: `seg-${ip}`, start: 0, end: 100, color: "#ffffff", brightness: 50 }],
    }

    manualDevices.set(device.id, device)
    return device
  }
}

export const goveeLanClient = new GoveeLanClient()

export function resetLanClientState() {
  inMemoryStates.clear()
  manualDevices.clear()
}
