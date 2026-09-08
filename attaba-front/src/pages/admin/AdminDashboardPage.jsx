import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useAdminData } from '../../context/AdminDataContext'
import { fetchOrders } from '../../services/api'
import { formatPrice } from '../../data/products'
import '../../components/admin/AdminLayout.css'

export default function AdminDashboardPage() {
  const { user, token, isAuthed } = useAuth()
  const { products, storewideDiscount, auditLog } = useAdminData()
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthed) return
    fetchOrders(token)
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.message))
  }, [isAuthed, token])

  const isAdmin = user?.role === 'admin'
  const totalOrders = orders?.length ?? 0
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total ?? 0), 0) ?? 0
  const outOfStock = products.filter((product) => product.quantity <= 0).length

  return (
    <AdminLayout
      title="Dashboard"
      description="Store overview: catalog health, order stats, and the latest admin activity."
    >
      {!isAuthed ? (
        <p className="admin-empty">
          <Link to="/account">Sign in</Link> as an admin to load order stats. Catalog numbers below
          work either way.
        </p>
      ) : !isAdmin ? (
        <p className="admin-empty">
          Signed in as {user.email} ({user.role}). Order stats require an admin account —
          try admin@figures.test.
        </p>
      ) : null}

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-stat-grid">
        <div className="admin-stat">
          <p className="admin-stat-label">Products</p>
          <p className="admin-stat-value">{products.length}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Out of stock</p>
          <p className="admin-stat-value">{outOfStock}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Orders</p>
          <p className="admin-stat-value">{isAdmin ? totalOrders : '—'}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-label">Revenue</p>
          <p className="admin-stat-value">{isAdmin ? formatPrice(totalRevenue) : '—'}</p>
        </div>
      </div>

      <div className="admin-card">
        <h2>Storewide discount</h2>
        {storewideDiscount ? (
          <p className="admin-card-sub">
            {storewideDiscount.percentage}% off everything, {new Date(storewideDiscount.startsAt).toLocaleString()} –{' '}
            {new Date(storewideDiscount.endsAt).toLocaleString()}
          </p>
        ) : (
          <p className="admin-card-sub">No storewide discount is scheduled right now.</p>
        )}
        <Link className="admin-btn admin-btn-sm" to="/admin/discounts">
          Manage discounts
        </Link>
      </div>

      <div className="admin-card">
        <h2>Recent admin activity</h2>
        {auditLog.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.slice(0, 5).map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.at).toLocaleTimeString()}</td>
                    <td>{entry.actor}</td>
                    <td>{entry.action}</td>
                    <td>{entry.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-card-sub">No admin actions yet this session.</p>
        )}
        <Link className="admin-btn admin-btn-sm admin-btn-ghost" to="/admin/audit-log">
          View full log
        </Link>
      </div>
    </AdminLayout>
  )
}
