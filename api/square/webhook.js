import { updateOrderStatusByOrderNumber, updateOrderStatusBySquareOrderId } from '../../lib/orders.js'

function mapSquareStatus(eventType) {
  if (eventType?.includes('payment.created') || eventType?.includes('payment.updated')) {
    return 'pending_payment'
  }
  if (eventType?.includes('payment.captured') || eventType?.includes('payment.completed')) {
    return 'paid'
  }
  if (eventType?.includes('payment.canceled')) {
    return 'canceled'
  }
  if (eventType?.includes('payment.refunded') || eventType?.includes('payment.failed')) {
    return 'failed'
  }
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    // TODO: Verify webhook signature with SQUARE_WEBHOOK_SIGNATURE_KEY before processing.
    // Signature verification should compare Square headers and raw request body.

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const eventType = event?.type
    const status = mapSquareStatus(eventType)

    if (!status) {
      return res.status(200).json({ received: true, ignored: true })
    }

    const squareOrderId = event?.data?.object?.payment?.order_id
    const referenceId = event?.data?.object?.payment?.reference_id

    if (squareOrderId) {
      await updateOrderStatusBySquareOrderId({ squareOrderId, status })
    } else if (referenceId) {
      await updateOrderStatusByOrderNumber({ orderNumber: referenceId, status })
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Square webhook error', error)
    return res.status(500).json({ error: 'Webhook processing failed.' })
  }
}
