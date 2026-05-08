"use client"

import { create } from "zustand"

import type { DevicePower, LightDevice, Scene } from "@/lib/domain/types"
import { mockDevices, mockScenes } from "@/lib/mocks/devices"

type LightState = {
  devices: LightDevice[]
  scenes: Scene[]
  selectedDeviceId?: string
  setDevices: (devices: LightDevice[]) => void
  setSelectedDevice: (id: string) => void
  setPower: (id: string, power: DevicePower) => void
  setBrightness: (id: string, brightness: number) => void
  setColor: (id: string, color: string) => void
}

export const useLightStore = create<LightState>((set) => ({
  devices: mockDevices,
  scenes: mockScenes,
  selectedDeviceId: mockDevices[0]?.id,
  setDevices: (devices) => set({ devices }),
  setSelectedDevice: (id) => set({ selectedDeviceId: id }),
  setPower: (id, power) =>
    set((state) => ({
      devices: state.devices.map((device) => (device.id === id ? { ...device, power } : device)),
    })),
  setBrightness: (id, brightness) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === id ? { ...device, brightness: Math.max(1, Math.min(100, brightness)) } : device,
      ),
    })),
  setColor: (id, color) =>
    set((state) => ({
      devices: state.devices.map((device) => (device.id === id ? { ...device, color } : device)),
    })),
}))
