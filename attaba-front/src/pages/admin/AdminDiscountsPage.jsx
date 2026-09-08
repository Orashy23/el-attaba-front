import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useAdminData } from '../../context/AdminDataContext'
import { formatPrice } from '../../data/products'
import '../../components/admin/AdminLayout.css'

function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function defaultWindow() {
  const start = new Date()
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
  return { startsAt: toLocalInputValue(start), endsAt: toLocalInputValue(end) }
}

export default function AdminDiscountsPage() {
  const { user } = useAuth()
  const {
    products,
    storewideDiscount,
    applyStorewideDiscount,
    clearStorewideDiscount,
    setProductDiscount,
    clearProductDiscount,
    getEffectiveDiscount,
  } = useAdminData()
  const actor = user?.email ?? 'admin'

  const [storeForm, setStoreForm] = useState({ percentage: '15', ...defaultWindow() })
  const [storeError, setStoreError] = useState('')

  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [productForm, setProductForm] = useState({ percentage: '10', ...defaultWindow() })
  const [productError, setProductError] = useState('')

  function onStorewideSubmit(event) {
    event.preventDefault()
    setStoreError('')
    try {
      applyStorewideDiscount(
        {
          percentage: Number(storeForm.percentage),
          startsAt: new Date(storeForm.startsAt).toISOString(),
          endsAt: new Date(storeForm.endsAt).toISOString(),
        },
        actor,
      )
    } catch (err) {
      setStoreError(err.message)
    }
  }

  function onProductSubmit(event) {
    event.preventDefault()
    setProductError('')
    if (!productId) {
      setProductError('Choose a product.')
      return
    }
    try {
      setProductDiscount(
        productId,
        {
          percentage: Number(productForm.percentage),
          startsAt: new Date(productForm.startsAt).toISOString(),
          endsAt: new Date(productForm.endsAt).toISOString(),
        },
        actor,
      )
    } catch (err) {
      setProductError(err.message)
    }
  }

  const discountedProducts = products.filter((product) => product.discountPercentage != null)

  return (
    <AdminLayout
      title="Discounts"
      description="Set a time-boxed discount on one figure or storewide. An active per-product discount always wins over a storewide one."
    >
      <form className="admin-card admin-form" onSubmit={onStorewideSubmit}>
        <h2>Storewide discount</h2>
        <p className="admin-card-sub">
          {storewideDiscount
            ? `Currently ${storewideDiscount.percentage}% off, ${new Date(storewideDiscount.startsAt).toLocaleString()} – ${new Date(storewideDiscount.endsAt).toLocaleString()}`
            : 'No storewide discount scheduled.'}
        </p>
        {storeError ? <p className="admin-error">{storeError}</p> : null}
        <div className="admin-form-grid">
          <label>
            Discount %
            <input
              type="number"
              min="0"
              max="100"
              value={storeForm.percentage}
              onChange={(e) => setStoreForm((f) => ({ ...f, percentage: e.target.value }))}
            />
          </label>
          <label>
            Starts
            <input
              type="datetime-local"
              value={storeForm.startsAt}
              onChange={(e) => setStoreForm((f) => ({ ...f, startsAt: e.target.value }))}
            />
          </label>
          <label>
            Ends
            <input
              type="datetime-local"
              value={storeForm.endsAt}
              onChange={(e) => setStoreForm((f) => ({ ...f, endsAt: e.target.value }))}
            />
          </label>
        </div>
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn">
            Apply storewide discount
          </button>
          {storewideDiscount ? (
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => clearStorewideDiscount(actor)}
            >
              Clear
            </button>
          ) : null}
        </div>
      </form>

      <form className="admin-card admin-form" onSubmit={onProductSubmit}>
        <h2>Per-product discount</h2>
        {productError ? <p className="admin-error">{productError}</p> : null}
        <div className="admin-form-grid">
          <label>
            Product
            <select value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Discount %
            <input
              type="number"
              min="0"
              max="100"
              value={productForm.percentage}
              onChange={(e) => setProductForm((f) => ({ ...f, percentage: e.target.value }))}
            />
          </label>
          <label>
            Starts
            <input
              type="datetime-local"
              value={productForm.startsAt}
              onChange={(e) => setProductForm((f) => ({ ...f, startsAt: e.target.value }))}
            />
          </label>
          <label>
            Ends
            <input
              type="datetime-local"
              value={productForm.endsAt}
              onChange={(e) => setProductForm((f) => ({ ...f, endsAt: e.target.value }))}
            />
          </label>
        </div>
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn">
            Apply product discount
          </button>
        </div>
      </form>

      <div className="admin-card">
        <h2>Products with a discount configured</h2>
        {discountedProducts.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Discount</th>
                  <th>Window</th>
                  <th>Status</th>
                  <th>Now</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {discountedProducts.map((product) => {
                  const effective = getEffectiveDiscount(product)
                  return (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>{product.discountPercentage}%</td>
                      <td>
                        {new Date(product.discountStartsAt).toLocaleString()} –{' '}
                        {new Date(product.discountEndsAt).toLocaleString()}
                      </td>
                      <td>
                        <span className={`admin-badge ${effective ? 'admin-badge-active' : 'admin-badge-off'}`}>
                          {effective ? 'Active' : 'Scheduled/expired'}
                        </span>
                      </td>
                      <td>{effective ? formatPrice(Math.round(product.price * (1 - effective.percentage / 100))) : '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn admin-btn-sm admin-btn-ghost"
                          onClick={() => clearProductDiscount(product.id, actor)}
                        >
                          Clear
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">No product has a discount window set.</p>
        )}
      </div>
    </AdminLayout>
  )
}
