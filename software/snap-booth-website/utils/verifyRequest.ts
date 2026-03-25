import crypto from "crypto"

export default function verifyRequest(request: Request, file: File) {
  const secret = process.env.DEVICE_UPLOAD_SECRET!

  const timestamp = request.headers.get("x-timestamp")
  const signature = request.headers.get("x-signature")

  if (!timestamp || !signature) return false

  const now = Math.floor(Date.now() / 1000)

  // Reject old requests beyond 5 min
  if (Math.abs(now - Number(timestamp)) > 300) return false

  return file.arrayBuffer().then(buffer => {
    const fileHash = crypto
      .createHash("sha256")
      .update(Buffer.from(buffer))
      .digest("hex")

    const message = `${timestamp}.${fileHash}`

    const expected = crypto
      .createHmac("sha256", secret)
      .update(message)
      .digest("hex")

    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    )
  })
}