import type { DevicePower, LightDevice } from "@/lib/domain/types"

export type DeviceStatePatch = {
  power?: DevicePower
  brightness?: number
  color?: string
}

export type AdapterResult = {
  power: DevicePower
  brightness: number
  color: string
}

export interface GoveeModelAdapter {
  id: string
  supportsModel: (model: string) => boolean
  applyState: (device: LightDevice, patch: DeviceStatePatch) => Promise<AdapterResult>
}
