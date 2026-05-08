import { NextResponse } from "next/server"

import {
  getLanDiscoveryMode,
  getLanTransportMode,
  isGoveeDebugEnabled,
  isLanAdapterEnabled,
} from "@/lib/govee/config"

export async function GET() {
  return NextResponse.json({
    data: {
      adapterEnabled: isLanAdapterEnabled(),
      transportMode: getLanTransportMode(),
      discoveryMode: getLanDiscoveryMode(),
      debugEnabled: isGoveeDebugEnabled(),
    },
  })
}
