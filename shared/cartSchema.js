const DEFAULT_CURRENCY = 'USD'

function toInt(value, fallback = 0) {
  const num = Number.parseInt(value, 10)
  return Number.isFinite(num) ? num : fallback
}

function parsePriceToCents(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value >= 100 ? Math.round(value) : Math.round(value * 100)
  }

  const numeric = Number.parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(numeric)) return 0
  return Math.round(numeric * 100)
}

function toArray(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return [String(value)]
}

export function normalizeCartItem(rawItem, index = 0) {
  const name = rawItem?.name || rawItem?.title || `Item ${index + 1}`
  const quantity = Math.max(1, toInt(rawItem?.quantity, 1))
  const priceCents = Math.max(0, parsePriceToCents(rawItem?.priceCents ?? rawItem?.price))

  const modifiers = [rawItem?.flavor, rawItem?.sauce, rawItem?.style, ...(rawItem?.modifiers || [])]
    .filter(Boolean)
    .map((mod) => String(mod))

  const toppings = toArray(rawItem?.toppings)
  const note = rawItem?.note || rawItem?.specialInstructions || ''

  return {
    id: String(rawItem?.id || `${name.toLowerCase().replace(/\s+/g, '-')}-${index}`),
    name: String(name),
    quantity,
    priceCents,
    size: rawItem?.size ? String(rawItem.size) : null,
    crust: rawItem?.crust ? String(rawItem.crust) : null,
    toppings,
    modifiers,
    note: String(note),
    currency: String(rawItem?.currency || DEFAULT_CURRENCY),
  }
}

export function normalizeCart(cart) {
  if (!Array.isArray(cart)) return []
  return cart.map((item, index) => normalizeCartItem(item, index))
}

export function validateCart(cart) {
  if (!Array.isArray(cart)) {
    return { valid: false, message: 'Cart must be an array.' }
  }

  if (cart.length === 0) {
    return { valid: false, message: 'Cart is empty.' }
  }

  for (let index = 0; index < cart.length; index += 1) {
    const item = cart[index]
    if (!item.name || typeof item.name !== 'string') {
      return { valid: false, message: `Item ${index + 1} is missing a valid name.` }
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return { valid: false, message: `Item ${index + 1} has an invalid quantity.` }
    }
    if (!Number.isInteger(item.priceCents) || item.priceCents < 0) {
      return { valid: false, message: `Item ${index + 1} has an invalid price.` }
    }
  }

  return { valid: true }
}
