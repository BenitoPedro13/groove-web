import type { LightDevice } from "@/lib/domain/types"

type DiscoveryResponsePayload = {
  msg?: {
    cmd?: string
    data?: {
      device?: string
      sku?: string
      ip?: string
      devName?: string
      deviceName?: string
    }
  }
}

export function buildDiscoveryRequest() {
  return {
    msg: {
      cmd: "scan",
      data: {
        account_topic: "reserve",
      },
    },
  }
}

export function parseDiscoveryResponse(message: string): LightDevice | null {
  try {
    const parsed = JSON.parse(message) as DiscoveryResponsePayload
    const data = parsed.msg?.data
    if (!data?.ip) return null

    const model = data.sku || data.device || "Unknown"
    const name = data.devName || data.deviceName || model

    return {
      id: `discovery-${data.ip.replaceAll(".", "-")}`,
      name,
      model,
      ip: data.ip,
      online: true,
      power: "off",
      brightness: 50,
      color: "#ffffff",
      segments: [{ id: `seg-${data.ip}`, start: 0, end: 100, color: "#ffffff", brightness: 50 }],
    }
  } catch {
    return null
  }
}
