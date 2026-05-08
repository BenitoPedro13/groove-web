function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) return fallback
  const normalized = value.trim().toLowerCase()
  if (normalized === "1" || normalized === "true" || normalized === "yes") return true
  if (normalized === "0" || normalized === "false" || normalized === "no") return false
  return fallback
}

export function isLanAdapterEnabled() {
  return parseBoolean(process.env.GOVEE_LAN_ADAPTER_ENABLED, true)
}
