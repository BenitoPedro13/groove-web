import { beforeEach, describe, expect, it } from "vitest"

import { goveeLanClient, resetLanClientState } from "../lan-client"
import { validateDeviceStatePatch, validateManualDeviceInput } from "../validators"
import { listRegisteredAdapters, resolveAdapter } from "../adapters/registry"
import { buildBrightnessCommand, buildColorCommand, buildPowerCommand } from "../protocol/h6-commands"
import {
  getLanDiscoveryBroadcastAddress,
  getLanDiscoveryMode,
  getLanDiscoveryPort,
  getLanDiscoveryTimeoutMs,
  isGoveeDebugEnabled,
  getLanTransportMode,
  getLanUdpPort,
} from "../config"
import { parseDiscoveryResponse } from "../protocol/discovery"

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

describe("lan command builders", () => {
  it("builds power command", () => {
    const cmd = buildPowerCommand("on")
    expect(cmd.msg.cmd).toBe("turn")
    expect(cmd.msg.data.value).toBe(1)
  })

  it("builds brightness and color commands", () => {
    const brightness = buildBrightnessCommand(68)
    const color = buildColorCommand("#ffaa11")
    expect(brightness.msg.cmd).toBe("brightness")
    expect(color.msg.cmd).toBe("colorwc")
  })
})

describe("lan config defaults", () => {
  it("uses mock transport by default", () => {
    expect(getLanTransportMode()).toBe("mock")
  })

  it("uses default govee UDP port", () => {
    expect(getLanUdpPort()).toBe(4003)
  })

  it("uses mock discovery defaults", () => {
    expect(getLanDiscoveryMode()).toBe("mock")
    expect(getLanDiscoveryPort()).toBe(4001)
    expect(getLanDiscoveryBroadcastAddress()).toBe("255.255.255.255")
    expect(getLanDiscoveryTimeoutMs()).toBe(1200)
  })

  it("disables debug logs by default", () => {
    expect(isGoveeDebugEnabled()).toBe(false)
  })
})

describe("discovery protocol parser", () => {
  it("parses a valid discovery response", () => {
    const result = parseDiscoveryResponse(
      JSON.stringify({
        msg: {
          cmd: "scan",
          data: {
            ip: "192.168.0.50",
            sku: "H619C",
            deviceName: "TV Backlight",
          },
        },
      }),
    )
    expect(result?.ip).toBe("192.168.0.50")
    expect(result?.model).toBe("H619C")
  })

  it("returns null for invalid discovery payload", () => {
    const result = parseDiscoveryResponse("{invalid-json")
    expect(result).toBeNull()
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
