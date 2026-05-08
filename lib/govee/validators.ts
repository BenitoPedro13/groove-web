import type { DevicePower } from "@/lib/domain/types"

export type DeviceStatePatch = {
  power?: DevicePower
  brightness?: number
  color?: string
}

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/
const IPV4_REGEX =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/

export function validateDeviceStatePatch(input: unknown): { ok: true; value: DeviceStatePatch } | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Payload must be an object." }
  }

  const payload = input as Record<string, unknown>
  const next: DeviceStatePatch = {}

  if ("power" in payload) {
    if (payload.power !== "on" && payload.power !== "off") {
      return { ok: false, error: "Invalid power value. Expected 'on' or 'off'." }
    }
    next.power = payload.power
  }

  if ("brightness" in payload) {
    if (typeof payload.brightness !== "number" || Number.isNaN(payload.brightness)) {
      return { ok: false, error: "Brightness must be a number between 0 and 100." }
    }
    if (payload.brightness < 0 || payload.brightness > 100) {
      return { ok: false, error: "Brightness must be between 0 and 100." }
    }
    next.brightness = Math.round(payload.brightness)
  }

  if ("color" in payload) {
    if (typeof payload.color !== "string" || !HEX_COLOR_REGEX.test(payload.color)) {
      return { ok: false, error: "Color must be a valid hex value, e.g. #ff00aa." }
    }
    next.color = payload.color
  }

  if (!("power" in payload) && !("brightness" in payload) && !("color" in payload)) {
    return { ok: false, error: "At least one field is required: power, brightness or color." }
  }

  return { ok: true, value: next }
}

export function validateManualDeviceInput(
  input: unknown,
): { ok: true; value: { ip: string; name?: string; model?: string } } | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Payload must be an object." }
  }

  const payload = input as Record<string, unknown>
  if (typeof payload.ip !== "string" || !IPV4_REGEX.test(payload.ip)) {
    return { ok: false, error: "A valid IPv4 address is required." }
  }

  const name = typeof payload.name === "string" && payload.name.trim() ? payload.name.trim() : undefined
  const model = typeof payload.model === "string" && payload.model.trim() ? payload.model.trim() : undefined

  return {
    ok: true,
    value: {
      ip: payload.ip,
      name,
      model,
    },
  }
}
