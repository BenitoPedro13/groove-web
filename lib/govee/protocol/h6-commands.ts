type GoveeMessage = {
  msg: {
    cmd: string
    data: Record<string, number | string>
  }
}

export function buildPowerCommand(power: "on" | "off"): GoveeMessage {
  return {
    msg: {
      cmd: "turn",
      data: {
        value: power === "on" ? 1 : 0,
      },
    },
  }
}

export function buildBrightnessCommand(brightness: number): GoveeMessage {
  return {
    msg: {
      cmd: "brightness",
      data: {
        value: Math.max(0, Math.min(100, Math.round(brightness))),
      },
    },
  }
}

export function buildColorCommand(hex: string): GoveeMessage {
  return {
    msg: {
      cmd: "colorwc",
      data: {
        color: hex,
      },
    },
  }
}
