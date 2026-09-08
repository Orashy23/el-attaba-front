import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getBestUserDiscount } from '../../data/userDiscounts'
import './DiscountBanner.css'

function formatRemaining(expiresAt) {
  const ms = Math.max(0, expiresAt - Date.now())
  const hours = Math.floor(ms / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  return `${hours}h ${minutes}m`
}

export default function DiscountBanner() {
  const { user, isAuthed } = useAuth()
  const [, forceTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!isAuthed) {
    return (
      <div className="discount-banner">
        <span className="discount-banner-badge">15% off</span>
        Sign in and your first order gets 15% off automatically at checkout.
      </div>
    )
  }

  const discount = getBestUserDiscount(user.id)
  if (!discount) return null

  return (
    <div className="discount-banner">
      <span className="discount-banner-badge">{discount.percentage}% off</span>
      {discount.source === 'first-order'
        ? "This is your first order — 15% off is applied automatically at checkout."
        : `Your post-order discount is active — expires in ${formatRemaining(discount.expiresAt)}.`}
    </div>
  )
}
