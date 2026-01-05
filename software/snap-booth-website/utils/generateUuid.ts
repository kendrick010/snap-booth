export default function generateUuidDateId(): string {
  const uuidPart = crypto.randomUUID().replace(/-/g, '').substring(0, 5)
  const now = new Date()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')

  return `${uuidPart}${month}${day}`.toLowerCase()
}