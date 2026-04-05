import { getDb } from './db.js'
import { randomUUID } from 'node:crypto'

export async function ensureOrdersTable() {
  const sql = getDb()

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL,
      items_json JSONB NOT NULL,
      subtotal_cents INTEGER NOT NULL,
      tax_cents INTEGER NOT NULL,
      total_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      fulfillment_type TEXT,
      customer_name TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      delivery_address TEXT,
      customer_note TEXT,
      square_payment_link_id TEXT,
      square_order_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function createPendingOrder({
  orderNumber,
  items,
  totals,
  currency = 'USD',
  fulfillmentType,
  customer = {},
  customerNote,
}) {
  const sql = getDb()

  const [order] = await sql`
    INSERT INTO orders (
      id,
      order_number,
      status,
      items_json,
      subtotal_cents,
      tax_cents,
      total_cents,
      currency,
      fulfillment_type,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      customer_note
    ) VALUES (
      ${randomUUID()},
      ${orderNumber},
      ${'pending_payment'},
      ${JSON.stringify(items)},
      ${totals.subtotalCents},
      ${totals.taxCents},
      ${totals.totalCents},
      ${currency},
      ${fulfillmentType || null},
      ${customer.name || null},
      ${customer.email || null},
      ${customer.phone || null},
      ${customer.address || null},
      ${customerNote || null}
    )
    RETURNING id, order_number
  `

  return order
}

export async function attachSquareReferences({
  orderNumber,
  squarePaymentLinkId,
  squareOrderId,
}) {
  const sql = getDb()

  await sql`
    UPDATE orders
    SET
      square_payment_link_id = ${squarePaymentLinkId || null},
      square_order_id = ${squareOrderId || null},
      updated_at = NOW()
    WHERE order_number = ${orderNumber}
  `
}

export async function updateOrderStatusByOrderNumber({ orderNumber, status }) {
  const sql = getDb()

  await sql`
    UPDATE orders
    SET
      status = ${status},
      updated_at = NOW()
    WHERE order_number = ${orderNumber}
  `
}

export async function updateOrderStatusBySquareOrderId({ squareOrderId, status }) {
  const sql = getDb()

  await sql`
    UPDATE orders
    SET
      status = ${status},
      updated_at = NOW()
    WHERE square_order_id = ${squareOrderId}
  `
}
