import test from 'node:test'
import assert from 'node:assert/strict'
import { createStore } from './store.js'
import { placeOrder } from './checkout.js'

const user = { id: 'u_user', role: 'user' }

function payload(extra = {}) {
  return {
    user,
    items: [{ productId: 'p1', qty: 1 }],
    address: 'New Cairo',
    phone: '01000000000',
    name: 'Test',
    ...extra,
  }
}

test('same Idempotency-Key returns the same order', async () => {
  const store = createStore()
  const first = await placeOrder(store, payload({ idempotencyKey: 'key-1' }))
  const second = await placeOrder(store, payload({ idempotencyKey: 'key-1' }))
  assert.equal(first.id, second.id)
  assert.equal(store.orders.size, 1)
  assert.equal(first.items[0].unitPriceSnapshot, store.products.find((p) => p.id === 'p1').price)
})

test('concurrent retries with one key create a single order', async () => {
  const store = createStore()
  const [a, b] = await Promise.all([
    placeOrder(store, payload({ idempotencyKey: 'key-race' })),
    placeOrder(store, payload({ idempotencyKey: 'key-race' })),
  ])
  assert.equal(a.id, b.id)
  assert.equal(store.orders.size, 1)
})

test('payment success + order insert failure starts compensation', async () => {
  const store = createStore()
  await assert.rejects(
    () => placeOrder(store, payload({ idempotencyKey: 'key-comp', simulateFailure: true })),
    (error) => {
      assert.equal(error.code, 'COMPENSATION_REQUIRED')
      assert.equal(error.order.status, 'compensation_required')
      assert.equal(error.order.payment.status, 'refund_pending')
      return true
    },
  )
})

test('different keys create different orders', async () => {
  const store = createStore()
  const first = await placeOrder(store, payload({ idempotencyKey: 'a' }))
  const second = await placeOrder(store, payload({ idempotencyKey: 'b' }))
  assert.notEqual(first.id, second.id)
  assert.equal(store.orders.size, 2)
})
