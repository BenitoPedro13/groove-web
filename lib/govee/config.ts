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

export type LanTransportMode = "mock" | "udp"
export type LanDiscoveryMode = "mock" | "udp"

export function getLanTransportMode(): LanTransportMode {
  const value = process.env.GOVEE_LAN_TRANSPORT?.trim().toLowerCase()
  if (value === "udp") return "udp"
  return "mock"
}

export function getLanUdpPort() {
  const value = Number(process.env.GOVEE_LAN_UDP_PORT)
  if (Number.isFinite(value) && value > 0 && value <= 65535) return value
  return 4003
}

export function getLanDiscoveryMode(): LanDiscoveryMode {
  const value = process.env.GOVEE_LAN_DISCOVERY_MODE?.trim().toLowerCase()
  if (value === "udp") return "udp"
  return "mock"
}

export function getLanDiscoveryPort() {
  const value = Number(process.env.GOVEE_LAN_DISCOVERY_PORT)
  if (Number.isFinite(value) && value > 0 && value <= 65535) return value
  return 4001
}

export function getLanDiscoveryBroadcastAddress() {
  return process.env.GOVEE_LAN_DISCOVERY_BROADCAST?.trim() || "255.255.255.255"
}

export function getLanDiscoveryTimeoutMs() {
  const value = Number(process.env.GOVEE_LAN_DISCOVERY_TIMEOUT_MS)
  if (Number.isFinite(value) && value >= 200 && value <= 10000) return value
  return 1200
}

export function isGoveeDebugEnabled() {
  return parseBoolean(process.env.GOVEE_DEBUG, false)
}
