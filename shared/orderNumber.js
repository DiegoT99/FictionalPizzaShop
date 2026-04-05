import { randomUUID } from 'node:crypto'

export function generateOrderNumber() {
  const short = randomUUID().split('-')[0].toUpperCase()
  return `FPS-${short}`
}
