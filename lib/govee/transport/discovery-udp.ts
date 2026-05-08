import dgram from "node:dgram"

import type { LightDevice } from "@/lib/domain/types"
import { buildDiscoveryRequest, parseDiscoveryResponse } from "@/lib/govee/protocol/discovery"

type DiscoverViaUdpOptions = {
  port: number
  broadcastAddress: string
  timeoutMs: number
}

export async function discoverViaUdp(options: DiscoverViaUdpOptions): Promise<LightDevice[]> {
  const socket = dgram.createSocket("udp4")
  const found = new Map<string, LightDevice>()
  const request = Buffer.from(JSON.stringify(buildDiscoveryRequest()), "utf8")

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.close()
      resolve()
    }, options.timeoutMs)

    socket.on("message", (msg) => {
      const parsed = parseDiscoveryResponse(msg.toString("utf8"))
      if (parsed?.ip) {
        found.set(parsed.ip, parsed)
      }
    })

    socket.on("error", (error) => {
      clearTimeout(timeout)
      socket.close()
      reject(error)
    })

    socket.bind(() => {
      try {
        socket.setBroadcast(true)
        socket.send(request, options.port, options.broadcastAddress)
      } catch (error) {
        clearTimeout(timeout)
        socket.close()
        reject(error)
      }
    })
  })

  return [...found.values()]
}
