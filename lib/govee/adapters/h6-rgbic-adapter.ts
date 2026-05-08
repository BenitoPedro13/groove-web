import type { LightDevice } from "@/lib/domain/types"
import type { AdapterResult, DeviceStatePatch, GoveeModelAdapter } from "@/lib/govee/adapters/types"
import { getLanTransportMode, getLanUdpPort } from "@/lib/govee/config"
import { goveeDebug } from "@/lib/govee/logger"
import { buildBrightnessCommand, buildColorCommand, buildPowerCommand } from "@/lib/govee/protocol/h6-commands"
import { sendUdpJson } from "@/lib/govee/transport/udp"

function mergePatch(device: LightDevice, patch: DeviceStatePatch): AdapterResult {
  return {
    power: patch.power ?? device.power,
    brightness: patch.brightness ?? device.brightness,
    color: patch.color ?? device.color,
  }
}

export const h6RgbicAdapter: GoveeModelAdapter = {
  id: "h6-rgbic-adapter",
  supportsModel: (model) => /^H6/i.test(model),
  applyState: async (device, patch) => {
    const next = mergePatch(device, patch)
    const transportMode = getLanTransportMode()
    goveeDebug("Applying state with H6 adapter", {
      deviceId: device.id,
      model: device.model,
      transportMode,
      patch,
    })

    if (transportMode === "mock") {
      await new Promise((resolve) => setTimeout(resolve, 35))
      return next
    }

    if (!device.ip) {
      throw new Error("Device IP is required for UDP transport.")
    }

    const port = getLanUdpPort()

    if (patch.power !== undefined) {
      await sendUdpJson({ ip: device.ip, port, payload: buildPowerCommand(next.power) })
    }
    if (patch.brightness !== undefined) {
      await sendUdpJson({ ip: device.ip, port, payload: buildBrightnessCommand(next.brightness) })
    }
    if (patch.color !== undefined) {
      await sendUdpJson({ ip: device.ip, port, payload: buildColorCommand(next.color) })
    }

    return next
  },
}
