import { NextResponse } from "next/server"

import { goveeLanClient } from "@/lib/govee/lan-client"

export async function GET() {
  const devices = await goveeLanClient.listDevices()
  return NextResponse.json({ data: devices })
}
