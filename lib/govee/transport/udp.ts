import dgram from "node:dgram"

type UdpJsonOptions = {
  ip: string
  port: number
  payload: unknown
  timeoutMs?: number
}

export async function sendUdpJson({ ip, port, payload, timeoutMs = 800 }: UdpJsonOptions): Promise<void> {
  const socket = dgram.createSocket("udp4")
  const buffer = Buffer.from(JSON.stringify(payload), "utf8")

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.close()
      reject(new Error("UDP send timed out"))
    }, timeoutMs)

    socket.send(buffer, port, ip, (error) => {
      clearTimeout(timer)
      socket.close()
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}
