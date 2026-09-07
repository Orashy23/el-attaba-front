import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import { useAuth } from '../context/AuthContext'
import { fetchOrders } from '../services/api'
import { mapOrderDto } from '../services/mapDto'
import './ProductPage.css'

export default function OrdersPage() {
  const { token, user } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders(token)
      .then(({ data }) => setOrders(data.map(mapOrderDto)))
      .catch((err) => setError(err.message))
  }, [token])

  return (
    <div className="simple-page">
      <div className="account-panel">
        <h1>{user?.role === 'admin' ? 'All orders' : 'Your orders'}</h1>
        <p className="muted">Customers only see orders they own. Admins can list every order.</p>
        {error ? <p className="form-error">{error}</p> : null}
        {!orders.length && !error ? <p>No orders yet.</p> : null}
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id}>
              <strong>{order.id}</strong>
              <span>{order.status}</span>
              <span>{formatPrice(order.total)}</span>
            </li>
          ))}
        </ul>
        <Link to="/category/deals">Browse deals</Link>
      </div>
    </div>
  )
}
