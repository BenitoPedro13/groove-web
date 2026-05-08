import { mockRgbicAdapter } from "@/lib/govee/adapters/mock-rgbic-adapter"
import type { GoveeModelAdapter } from "@/lib/govee/adapters/types"

const adapters: GoveeModelAdapter[] = [mockRgbicAdapter]

export function resolveAdapter(model: string): GoveeModelAdapter | null {
  return adapters.find((adapter) => adapter.supportsModel(model)) ?? null
}

export function listRegisteredAdapters() {
  return adapters.map((adapter) => adapter.id)
}
