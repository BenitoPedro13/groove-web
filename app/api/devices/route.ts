import { NextResponse } from "next/server"

import { goveeLanClient } from "@/lib/govee/lan-client"

export async function GET() {
  try {
    const devices = await goveeLanClient.listDevices()
    return NextResponse.json({ data: devices })
  } catch {
    return NextResponse.json({ error: "Failed to list devices." }, { status: 500 })
  }
}
