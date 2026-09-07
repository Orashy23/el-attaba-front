import { randomUUID } from 'node:crypto'
import { log } from './logger.js'
import { toOrderDto } from './dtos.js'

const STATES = ['pending_payment', 'paid', 'placed', 'compensation_required', 'cancelled']

export function canTransition(from, to) {
  const allowed = {
    pending_payment: ['paid', 'cancelled', 'compensation_required'],
    paid: ['placed', 'compensation_required'],
    placed: [],
    compensation_required: ['cancelled'],
    cancelled: [],
  }
  return STATES.includes(to) && (allowed[from] || []).includes(to)
}

function mockCharge() {
  return {
    id: `pay_${randomUUID()}`,
    provider: 'instapay_mock',
    status: 'paid',
  }
}

function mockRefund(payment) {
  return { ...payment, status: 'refund_pending' }
}

function snapshotItems(store, requested) {
  return requested.map((line) => {
    const product = store.products.find((item) => item.id === line.productId)
    if (!product) {
      const err = new Error(`Unknown product ${line.productId}`)
      err.code = 'VALIDATION_ERROR'
      throw err
    }
    const qty = Number(line.qty)
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      const err = new Error('Quantity must be 1–10')
      err.code = 'VALIDATION_ERROR'
      throw err
    }
    return {
      productId: product.id,
      title: product.title,
      qty,
      unitPriceSnapshot: product.price,
    }
  })
}

async function executeCheckout(store, { user, items, address, phone, name, simulateFailure }) {
  const snapshotted = snapshotItems(store, items)
  const total = snapshotted.reduce((sum, item) => sum + item.unitPriceSnapshot * item.qty, 0)
  const orderId = `ord_${randomUUID()}`

  let order = {
    id: orderId,
    status: 'pending_payment',
    customerId: user.id,
    items: snapshotted,
    total,
    address,
    phone,
    name,
    payment: { id: null, provider: 'instapay_mock', status: 'pending' },
    compensation: null,
    createdAt: new Date().toISOString(),
  }

  const payment = mockCharge()
  order = { ...order, status: 'paid', payment }

  if (simulateFailure) {
    order = {
      ...order,
      status: 'compensation_required',
      payment: mockRefund(payment),
      compensation: {
        reason: 'payment_succeeded_order_insert_failed',
        action: 'reverse_or_hold_payment_then_retry_order_create',
      },
    }
    store.orders.set(order.id, order)
    log('error', 'order_compensation', { orderId: order.id, paymentId: payment.id })
    const err = new Error('Order create failed after payment. Compensation started.')
    err.code = 'COMPENSATION_REQUIRED'
    err.order = order
    throw err
  }

  order = { ...order, status: 'placed' }
  store.orders.set(order.id, order)
  log('info', 'order_placed', { orderId: order.id, total, customerId: user.id })
  return order
}

export function placeOrder(store, input) {
  const key = String(input.idempotencyKey || '').trim()
  if (!key) {
    const err = new Error('Idempotency-Key is required')
    err.code = 'VALIDATION_ERROR'
    throw err
  }

  const existing = store.idempotency.get(key)
  if (existing?.order) return Promise.resolve(existing.order)

  const running = store.inflight.get(key)
  if (running) return running

  const job = (async () => {
    try {
      const order = await executeCheckout(store, input)
      store.idempotency.set(key, { order, status: 201 })
      return order
    } catch (error) {
      if (error.code === 'COMPENSATION_REQUIRED') {
        store.idempotency.set(key, { order: error.order, status: 409 })
      }
      throw error
    } finally {
      store.inflight.delete(key)
    }
  })()

  store.inflight.set(key, job)
  return job
}

export function listOrdersFor(store, user) {
  const all = [...store.orders.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  if (user.role === 'admin') return all.map(toOrderDto)
  return all.filter((order) => order.customerId === user.id).map(toOrderDto)
}

export function getOwnedOrder(store, user, id) {
  const order = store.orders.get(id)
  if (!order) return { status: 404 }
  if (user.role !== 'admin' && order.customerId !== user.id) return { status: 403 }
  return { status: 200, order }
}
