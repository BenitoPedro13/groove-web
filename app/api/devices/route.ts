import { NextResponse } from "next/server"

import { goveeLanClient } from "@/lib/govee/lan-client"
import { validateManualDeviceInput } from "@/lib/govee/validators"

export async function GET() {
  try {
    const devices = await goveeLanClient.listDevices()
    return NextResponse.json({ data: devices })
  } catch {
    return NextResponse.json({ error: "Failed to list devices." }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown
    const validation = validateManualDeviceInput(body)

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const device = goveeLanClient.registerManualDevice(validation.value.ip, validation.value.name, validation.value.model)
    return NextResponse.json({ data: device }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to register manual device." }, { status: 500 })
  }
}
