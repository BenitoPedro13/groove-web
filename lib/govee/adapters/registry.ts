import { h6RgbicAdapter } from "@/lib/govee/adapters/h6-rgbic-adapter"
import type { GoveeModelAdapter } from "@/lib/govee/adapters/types"

const adapters: GoveeModelAdapter[] = [h6RgbicAdapter]

export function resolveAdapter(model: string): GoveeModelAdapter | null {
  return adapters.find((adapter) => adapter.supportsModel(model)) ?? null
}

export function listRegisteredAdapters() {
  return adapters.map((adapter) => adapter.id)
}
