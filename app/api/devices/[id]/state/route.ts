import { NextResponse } from "next/server"

import { goveeLanClient } from "@/lib/govee/lan-client"
import { validateDeviceStatePatch } from "@/lib/govee/validators"

type Params = {
  params: Promise<{ id: string }>
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = (await req.json()) as unknown
    const validation = validateDeviceStatePatch(body)

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const next = await goveeLanClient.updateDeviceState(id, validation.value)
    if (!next) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    return NextResponse.json({ data: next })
  } catch {
    return NextResponse.json({ error: "Failed to update device state." }, { status: 500 })
  }
}
