import { randomUUID } from 'node:crypto'
import { normalizeCart, validateCart } from '../shared/cartSchema.js'
import { calculateTotals } from '../shared/calculateTotals.js'
import { generateOrderNumber } from '../shared/orderNumber.js'
import {
  attachSquareReferences,
  createPendingOrder,
  ensureOrdersTable,
} from '../lib/orders.js'

const TAX_RATE = Number.parseFloat(process.env.CHECKOUT_TAX_RATE || '0')

function getSquareBaseUrl() {
  const env = process.env.SQUARE_ENVIRONMENT || 'sandbox'
  return env === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com'
}

function getRequestBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

function toSquareLineItem(item) {
  const modifierLabels = [
    item.size,
    item.crust,
    ...item.modifiers,
    ...item.toppings,
  ].filter(Boolean)

  const modifiers = modifierLabels.map((label) => ({
    name: String(label),
    base_price_money: {
      amount: 0,
      currency: item.currency || 'USD',
    },
  }))

  return {
    name: item.name,
    quantity: String(item.quantity),
    base_price_money: {
      amount: item.priceCents,
      currency: item.currency || 'USD',
    },
    note: item.note || undefined,
    ...(modifiers.length ? { modifiers } : {}),
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const squareEnvironment = process.env.SQUARE_ENVIRONMENT || 'sandbox'
  const allowLivePayments = process.env.ALLOW_LIVE_PAYMENTS === 'true'

  if (squareEnvironment === 'production' && !allowLivePayments) {
    return res.status(403).json({
      error:
        'Demo mode is enabled. Live payments are blocked. Set ALLOW_LIVE_PAYMENTS=true to enable production checkout.',
    })
  }

  const accessToken = process.env.SQUARE_ACCESS_TOKEN
  const locationId = process.env.SQUARE_LOCATION_ID

  if (!accessToken || !locationId) {
    return res.status(500).json({ error: 'Square credentials are not configured.' })
  }

  try {
    const payload = getRequestBody(req)
    const normalizedItems = normalizeCart(payload.cartItems)
    const validation = validateCart(normalizedItems)

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message })
    }

    const deliveryFeeCents = payload.fulfillmentType === 'delivery' ? 400 : 0
    const totals = calculateTotals({
      items: normalizedItems,
      taxRate: TAX_RATE,
      deliveryFeeCents,
    })

    if (totals.totalCents < 1) {
      return res.status(400).json({ error: 'Cart total must be greater than zero.' })
    }

    await ensureOrdersTable()

    const orderNumber = generateOrderNumber()
    await createPendingOrder({
      orderNumber,
      items: normalizedItems,
      totals,
      currency: 'USD',
      fulfillmentType: payload.fulfillmentType,
      customer: payload.customer,
      customerNote: payload.customerNote,
    })

    const lineItems = normalizedItems.map(toSquareLineItem)
    if (deliveryFeeCents > 0) {
      lineItems.push({
        name: 'Delivery Fee',
        quantity: '1',
        base_price_money: {
          amount: deliveryFeeCents,
          currency: 'USD',
        },
      })
    }

    const successBaseUrl = process.env.CHECKOUT_SUCCESS_URL || `${payload.siteUrl || ''}/checkout/success`

    const response = await fetch(`${getSquareBaseUrl()}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': '2025-10-16',
      },
      body: JSON.stringify({
        idempotency_key: randomUUID(),
        order: {
          location_id: locationId,
          reference_id: orderNumber,
          line_items: lineItems,
          taxes:
            TAX_RATE > 0
              ? [
                  {
                    name: 'Sales Tax',
                    percentage: (TAX_RATE * 100).toFixed(2),
                    scope: 'ORDER',
                  },
                ]
              : undefined,
        },
        checkout_options: {
          redirect_url: `${successBaseUrl}?order=${orderNumber}`,
        },
        pre_populated_data: {
          buyer_email: payload?.customer?.email || undefined,
        },
      }),
    })

    const squareData = await response.json()

    if (!response.ok || !squareData?.payment_link?.url) {
      const squareErrorDetail = squareData?.errors?.[0]?.detail || null
      const squareErrorCode = squareData?.errors?.[0]?.code || null
      console.error('Square checkout creation failed', {
        status: response.status,
        squareData,
        orderNumber,
      })
      return res.status(502).json({
        error: squareErrorDetail || 'Unable to create hosted checkout session. Please try again.',
        squareCode: squareErrorCode,
      })
    }

    await attachSquareReferences({
      orderNumber,
      squarePaymentLinkId: squareData?.payment_link?.id,
      squareOrderId: squareData?.payment_link?.order_id,
    })

    return res.status(200).json({
      checkoutUrl: squareData.payment_link.url,
      orderNumber,
    })
  } catch (error) {
    console.error('Checkout API error', error)
    return res.status(500).json({ error: 'Checkout failed. Please try again.' })
  }
}
