import type { LightDevice } from "@/lib/domain/types"
import type { AdapterResult, DeviceStatePatch, GoveeModelAdapter } from "@/lib/govee/adapters/types"

function mergePatch(device: LightDevice, patch: DeviceStatePatch): AdapterResult {
  return {
    power: patch.power ?? device.power,
    brightness: patch.brightness ?? device.brightness,
    color: patch.color ?? device.color,
  }
}

export const mockRgbicAdapter: GoveeModelAdapter = {
  id: "mock-rgbic-adapter",
  supportsModel: (model) => /^H6/i.test(model),
  applyState: async (device, patch) => {
    // Stub for a real LAN transport adapter per device model.
    await new Promise((resolve) => setTimeout(resolve, 35))
    return mergePatch(device, patch)
  },
}
