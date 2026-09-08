import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useAdminData } from '../../context/AdminDataContext'
import { fetchOrders } from '../../services/api'
import { formatPrice } from '../../data/products'
import '../../components/admin/AdminLayout.css'
import './AdminAnalytics.css'

const TOP_N_OPTIONS = [5, 10, 16]

export default function AdminAnalyticsPage() {
  const { user, token, isAuthed } = useAuth()
  const { products } = useAdminData()
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')
  const [topN, setTopN] = useState(5)
  const [metric, setMetric] = useState('units') // 'units' | 'revenue'

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (!isAuthed || !isAdmin) return
    fetchOrders(token)
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.message))
  }, [isAuthed, isAdmin, token])

  const productTitle = useMemo(() => {
    const map = new Map()
    products.forEach((product) => map.set(product.id, product.title))
    return map
  }, [products])

  const totals = useMemo(() => {
    const byProduct = new Map()
    ;(orders ?? []).forEach((order) => {
      order.items?.forEach((item) => {
        const key = item.productId
        const current = byProduct.get(key) ?? { units: 0, revenue: 0 }
        current.units += item.qty
        current.revenue += item.lineTotal ?? item.unitPriceSnapshot * item.qty
        byProduct.set(key, current)
      })
    })
    return byProduct
  }, [orders])

  const ranked = useMemo(() => {
    const rows = [...totals.entries()].map(([productId, stats]) => ({
      productId,
      title: productTitle.get(productId) ?? productId,
      units: stats.units,
      revenue: stats.revenue,
    }))
    rows.sort((a, b) => b[metric] - a[metric])
    return rows
  }, [totals, productTitle, metric])

  const totalForMetric = ranked.reduce((sum, row) => sum + row[metric], 0)
  const mostSold = ranked.slice(0, topN)
  const maxValue = mostSold[0]?.[metric] ?? 0

  return (
    <AdminLayout
      title="Sales analytics"
      description="Most-sold figures and each product's share of total sales, computed from real orders."
    >
      {!isAuthed || !isAdmin ? (
        <p className="admin-empty">
          <Link to="/account">Sign in</Link> as admin@figures.test to load sales data.
        </p>
      ) : null}
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-card">
        <div className="analytics-controls">
          <h2 className="analytics-controls-title">Most sold</h2>
          <div className="analytics-filter-row" role="group" aria-label="Chart filters">
            <div className="analytics-toggle" role="radiogroup" aria-label="Metric">
              {[
                { id: 'units', label: 'By units' },
                { id: 'revenue', label: 'By revenue' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={metric === option.id}
                  className={`analytics-toggle-btn ${metric === option.id ? 'is-active' : ''}`}
                  onClick={() => setMetric(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className="analytics-select">
              Top
              <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}>
                {TOP_N_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {mostSold.length ? (
          <ul className="analytics-bars" aria-label={`Top ${mostSold.length} products by ${metric}`}>
            {mostSold.map((row) => (
              <li key={row.productId} className="analytics-bar-row">
                <span className="analytics-bar-label">{row.title}</span>
                <span
                  className="analytics-bar-track"
                  title={`${row.title}: ${metric === 'units' ? `${row.units} units` : formatPrice(row.revenue)}`}
                >
                  <span
                    className="analytics-bar-fill"
                    style={{ width: `${maxValue ? (row[metric] / maxValue) * 100 : 0}%` }}
                  />
                </span>
                <span className="analytics-bar-value">
                  {metric === 'units' ? `${row.units} sold` : formatPrice(row.revenue)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-empty">No completed orders yet — place an order to see it here.</p>
        )}
      </div>

      <div className="admin-card">
        <h2>Sales distribution</h2>
        <p className="admin-card-sub">Each product's share of total {metric === 'units' ? 'units' : 'revenue'} sold.</p>
        {ranked.length ? (
          <ul className="analytics-bars" aria-label="Sales distribution">
            {ranked.slice(0, 8).map((row) => {
              const share = totalForMetric ? (row[metric] / totalForMetric) * 100 : 0
              return (
                <li key={row.productId} className="analytics-bar-row">
                  <span className="analytics-bar-label">{row.title}</span>
                  <span className="analytics-bar-track" title={`${row.title}: ${share.toFixed(1)}%`}>
                    <span className="analytics-bar-fill analytics-bar-fill-alt" style={{ width: `${share}%` }} />
                  </span>
                  <span className="analytics-bar-value">{share.toFixed(1)}%</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="admin-empty">No sales data yet.</p>
        )}
      </div>
    </AdminLayout>
  )
}
