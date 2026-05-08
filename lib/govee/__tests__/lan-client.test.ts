import { beforeEach, describe, expect, it } from "vitest"

import { goveeLanClient, resetLanClientState } from "../lan-client"
import { validateDeviceStatePatch } from "../validators"

describe("govee lan client", () => {
  beforeEach(() => {
    resetLanClientState()
  })

  it("lists mock devices", async () => {
    const devices = await goveeLanClient.listDevices()
    expect(devices.length).toBeGreaterThan(0)
    expect(devices[0]).toHaveProperty("id")
  })

  it("updates device brightness in memory", async () => {
    const devices = await goveeLanClient.listDevices()
    const first = devices[0]
    const updated = await goveeLanClient.updateDeviceState(first.id, { brightness: 34 })

    expect(updated).not.toBeNull()
    expect(updated?.brightness).toBe(34)
  })

  it("returns null for unknown device id", async () => {
    const updated = await goveeLanClient.updateDeviceState("unknown-id", { power: "on" })
    expect(updated).toBeNull()
  })
})

describe("device payload validation", () => {
  it("accepts valid payload", () => {
    const result = validateDeviceStatePatch({ power: "on", brightness: 50, color: "#ff00aa" })
    expect(result.ok).toBe(true)
  })

  it("rejects invalid brightness", () => {
    const result = validateDeviceStatePatch({ brightness: 300 })
    expect(result.ok).toBe(false)
  })

  it("rejects empty payload", () => {
    const result = validateDeviceStatePatch({})
    expect(result.ok).toBe(false)
  })
})
