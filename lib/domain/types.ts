export type DevicePower = "on" | "off"

export type Segment = {
  id: string
  start: number
  end: number
  color: string
  brightness: number
}

export type Effect = {
  id: string
  name: string
  speed: number
  intensity: number
}

export type LightDevice = {
  id: string
  name: string
  model: string
  ip?: string
  online: boolean
  power: DevicePower
  brightness: number
  color: string
  effectId?: string
  segments: Segment[]
}

export type Scene = {
  id: string
  name: string
  icon: string
  deviceIds: string[]
  effectId?: string
}
