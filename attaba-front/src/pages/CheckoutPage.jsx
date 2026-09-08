import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { placeOrderRequest } from '../services/api'
import { mapOrderDto } from '../services/mapDto'
import { getBestUserDiscount, recordOrderCompleted } from '../data/userDiscounts'
import DiscountBanner from '../components/discounts/DiscountBanner'
import './ProductPage.css'

export default function CheckoutPage() {
  const { items, subtotal, count, clearCart } = useCart()
  const { token, user } = useAuth()
  const idempotencyKey = useRef(crypto.randomUUID())
  const [name, setName] = useState(user?.name || '')
  const [address, setAddress] = useState('New Cairo, Egypt')
  const [phone, setPhone] = useState('01000000000')
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  const [paidSummary, setPaidSummary] = useState(null)

  const discount = getBestUserDiscount(user?.id)
  const discountPercentage = discount?.percentage ?? 0
  const discountAmount = Math.round((subtotal * discountPercentage) / 100)
  const payableTotal = subtotal - discountAmount

  async function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await placeOrderRequest({
        token,
        idempotencyKey: idempotencyKey.current,
        payload: {
          name,
          address,
          phone,
          simulateFailure,
          items: items.map((item) => ({
            productId: item.id,
            qty: item.qty,
            color: item.color,
            size: item.size,
          })),
        },
      })
      const mapped = mapOrderDto(result.data)
      if (mapped.status !== 'compensation_required') {
        setPaidSummary({ discountPercentage, discountAmount, payableTotal, subtotal })
        recordOrderCompleted(user.id)
      }
      setOrder(mapped)
      clearCart()
    } catch (err) {
      if (err.code === 'COMPENSATION_REQUIRED' && err.payload?.data) {
        setOrder(mapOrderDto(err.payload.data))
        return
      }
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (order) {
    const failed = order.status === 'compensation_required'
    return (
      <div className="checkout-page">
        <div className="checkout-card">
          <h1>{failed ? 'Payment held' : 'Order placed'}</h1>
          <p>Order {order.id}</p>
          <p>Status: {order.status}</p>
          {failed ? (
            <p className="muted">
              Payment succeeded but order create failed. The mock Instapay charge is marked refund_pending
              so we do not double-charge. Retry uses the same Idempotency-Key.
            </p>
          ) : (
            <>
              {paidSummary?.discountPercentage > 0 ? (
                <p>
                  {paidSummary.discountPercentage}% discount applied · you saved{' '}
                  {formatPrice(paidSummary.discountAmount)}
                </p>
              ) : null}
              <p>
                Total paid: <strong>{formatPrice(paidSummary?.payableTotal ?? order.total)}</strong>
              </p>
              <p className="muted">
                Line prices are snapshots copied at checkout, not live product prices. Payment was mocked
                (Instapay). Refreshing will not create a second order.
              </p>
              <p className="muted">You've unlocked 15% off for the next 72 hours on your next order.</p>
            </>
          )}
          <Link to="/orders">View orders</Link>
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="checkout-page">
        <div className="checkout-card">
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
          <Link to="/">Continue shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <DiscountBanner />
      <div className="checkout-layout">
        <section className="checkout-card">
          <h1>Checkout</h1>
          <p className="muted">
            Payment is mocked as Instapay. This page is auth-protected. Place order sends Idempotency-Key{' '}
            <code>{idempotencyKey.current.slice(0, 8)}</code>…
          </p>
          <form onSubmit={onSubmit}>
            <label>
              Full name
              <input required name="name" value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              Delivery address
              <input required name="address" value={address} onChange={(event) => setAddress(event.target.value)} />
            </label>
            <label>
              Phone
              <input required name="phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(event) => setSimulateFailure(event.target.checked)}
              />
              Simulate payment-ok / order-fail (compensation)
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="primary-btn" disabled={busy}>
              {busy ? 'Placing…' : `Place order · ${formatPrice(payableTotal)}`}
            </button>
          </form>
        </section>
        <aside className="cart-summary">
          <p>
            {count} items · <strong>{formatPrice(subtotal)}</strong>
          </p>
          {discountPercentage > 0 ? (
            <p className="checkout-discount-line">
              Your discount ({discountPercentage}%): -{formatPrice(discountAmount)}
            </p>
          ) : null}
          <p>
            Total: <strong>{formatPrice(payableTotal)}</strong>
          </p>
          <ul>
            {items.map((item) => (
              <li key={item.lineId}>
                {item.title}
                {item.color ? ` — ${item.color}` : ''}
                {item.size ? ` / ${item.size}` : ''} × {item.qty} · snapshot{' '}
                {formatPrice(item.unitPriceSnapshot ?? item.price)}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
