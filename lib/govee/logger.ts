import { isGoveeDebugEnabled } from "@/lib/govee/config"

type Meta = Record<string, unknown>

function formatMeta(meta?: Meta) {
  if (!meta) return ""
  try {
    return ` ${JSON.stringify(meta)}`
  } catch {
    return ""
  }
}

export function goveeDebug(message: string, meta?: Meta) {
  if (!isGoveeDebugEnabled()) return
  console.info(`[govee:debug] ${message}${formatMeta(meta)}`)
}

export function goveeWarn(message: string, meta?: Meta) {
  console.warn(`[govee:warn] ${message}${formatMeta(meta)}`)
}
