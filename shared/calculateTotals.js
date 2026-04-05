export function calculateTotals({
  items,
  taxRate = 0,
  deliveryFeeCents = 0,
}) {
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  )

  const taxCents = Math.round(subtotalCents * taxRate)
  const totalCents = subtotalCents + taxCents + deliveryFeeCents
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    subtotalCents,
    taxCents,
    deliveryFeeCents,
    totalCents,
    itemCount,
  }
}

export function centsToDollars(cents) {
  return (cents / 100).toFixed(2)
}
