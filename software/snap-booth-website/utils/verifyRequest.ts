import crypto from "crypto"

export default async function verifyRequest(request: Request, file: File) {
  const secret = process.env.DEVICE_UPLOAD_SECRET!

  const timestamp = request.headers.get("x-timestamp")
  const signature = request.headers.get("x-signature")

  if (!timestamp || !signature) return false

  const now = Math.floor(Date.now() / 1000)

  if (Math.abs(now - Number(timestamp)) > 300) return false

  const buffer = await file.arrayBuffer()

  const fileHash = crypto
    .createHash("sha256")
    .update(Buffer.from(buffer))
    .digest("hex")

  const message = `${timestamp}.${fileHash}`

  const expected = crypto
    .createHmac("sha256", Buffer.from(secret, "utf-8"))
    .update(message)
    .digest("hex")

  console.log("message:", message)
  console.log("expected:", expected)
  console.log("received:", signature)

  if (expected.length !== signature.length) return false

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  )
}