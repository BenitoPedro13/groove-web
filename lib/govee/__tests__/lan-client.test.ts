import { beforeEach, describe, expect, it } from "vitest"

import { goveeLanClient, resetLanClientState } from "../lan-client"
import { validateDeviceStatePatch, validateManualDeviceInput } from "../validators"
import { listRegisteredAdapters, resolveAdapter } from "../adapters/registry"

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

  it("registers manual device by ip", async () => {
    const created = goveeLanClient.registerManualDevice("192.168.1.99", "Manual", "H7000")
    expect(created.ip).toBe("192.168.1.99")

    const devices = await goveeLanClient.listDevices()
    expect(devices.some((item) => item.ip === "192.168.1.99")).toBe(true)
  })
})

describe("model adapter registry", () => {
  it("resolves adapter for H6 models", () => {
    const adapter = resolveAdapter("H619C")
    expect(adapter).not.toBeNull()
  })

  it("lists at least one registered adapter", () => {
    expect(listRegisteredAdapters().length).toBeGreaterThan(0)
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

  it("accepts valid manual device input", () => {
    const result = validateManualDeviceInput({ ip: "192.168.0.10", name: "Desk Strip", model: "H61XX" })
    expect(result.ok).toBe(true)
  })

  it("rejects invalid manual device ip", () => {
    const result = validateManualDeviceInput({ ip: "999.1.1.1" })
    expect(result.ok).toBe(false)
  })
})
