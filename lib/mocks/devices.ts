import type { Effect, LightDevice, Scene } from "@/lib/domain/types"

export const mockEffects: Effect[] = [
  { id: "sunset", name: "Sunset", speed: 40, intensity: 65 },
  { id: "neon-wave", name: "Neon Wave", speed: 75, intensity: 80 },
  { id: "aurora", name: "Aurora", speed: 55, intensity: 70 },
]

export const mockDevices: LightDevice[] = [
  {
    id: "dev-1",
    name: "TV Backlight",
    model: "H619C",
    ip: "192.168.15.20",
    online: true,
    power: "on",
    brightness: 72,
    color: "#8b5cf6",
    effectId: "neon-wave",
    segments: [
      { id: "seg-1", start: 0, end: 25, color: "#8b5cf6", brightness: 72 },
      { id: "seg-2", start: 26, end: 50, color: "#ec4899", brightness: 70 },
      { id: "seg-3", start: 51, end: 100, color: "#06b6d4", brightness: 74 },
    ],
  },
  {
    id: "dev-2",
    name: "Office Strip",
    model: "H61A0",
    ip: "192.168.15.21",
    online: true,
    power: "off",
    brightness: 45,
    color: "#22c55e",
    segments: [{ id: "seg-4", start: 0, end: 100, color: "#22c55e", brightness: 45 }],
  },
]

export const mockScenes: Scene[] = [
  { id: "scene-1", name: "Movie Night", icon: "film", deviceIds: ["dev-1"], effectId: "sunset" },
  { id: "scene-2", name: "Focus", icon: "sparkles", deviceIds: ["dev-2"] },
]
