import { NextResponse } from "next/server"

import type { DevicePower } from "@/lib/domain/types"
import { goveeLanClient } from "@/lib/govee/lan-client"

type Params = {
  params: Promise<{ id: string }>
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params
  const body = (await req.json()) as {
    power?: DevicePower
    brightness?: number
    color?: string
  }

  const next = await goveeLanClient.updateDeviceState(id, body)
  if (!next) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 })
  }

  return NextResponse.json({ data: next })
}
