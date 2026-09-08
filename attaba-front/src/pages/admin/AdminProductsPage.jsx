import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { useAdminData } from '../../context/AdminDataContext'
import { categories, formatPrice } from '../../data/products'
import '../../components/admin/AdminLayout.css'

const productCategories = categories.filter((item) => !['all', 'deals', 'bestsellers'].includes(item.id))

const emptyForm = {
  title: '',
  category: productCategories[0]?.id ?? 'marvel',
  price: '',
  originalPrice: '',
  quantity: '',
  displayOrder: '',
  image: '',
  description: '',
  badge: '',
}

export default function AdminProductsPage() {
  const { user } = useAuth()
  const { products, createProduct, updateProduct, deleteProduct } = useAdminData()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const sorted = [...products].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  const actor = user?.email ?? 'admin'

  function onChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      title: product.title,
      category: product.category,
      price: String(product.price),
      originalPrice: String(product.originalPrice ?? product.price),
      quantity: String(product.quantity ?? 0),
      displayOrder: String(product.displayOrder ?? ''),
      image: product.image,
      description: product.description,
      badge: product.badge ?? '',
    })
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  function onSubmit(event) {
    event.preventDefault()
    setError('')
    if (!form.title.trim() || !form.price) {
      setError('Title and price are required.')
      return
    }

    const payload = {
      title: form.title,
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice === '' ? Number(form.price) : Number(form.originalPrice),
      quantity: form.quantity === '' ? 0 : Number(form.quantity),
      displayOrder: form.displayOrder === '' ? null : Number(form.displayOrder),
      image: form.image,
      description: form.description,
      badge: form.badge || null,
    }

    if (editingId) {
      updateProduct(editingId, payload, actor)
    } else {
      createProduct(payload, actor)
    }
    cancelEdit()
  }

  function onDelete(product) {
    if (!window.confirm(`Delete "${product.title}"? This can't be undone.`)) return
    deleteProduct(product.id, actor)
    if (editingId === product.id) cancelEdit()
  }

  return (
    <AdminLayout
      title="Products"
      description="Create, edit, and remove figures. Display order controls where a product lands on the front page; leave it blank to append to the end."
    >
      <form className="admin-card admin-form" onSubmit={onSubmit}>
        <h2>{editingId ? 'Edit product' : 'New product'}</h2>
        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-form-grid">
          <label>
            Title
            <input value={form.title} onChange={(e) => onChange('title', e.target.value)} required />
          </label>
          <label>
            Category
            <select value={form.category} onChange={(e) => onChange('category', e.target.value)}>
              {productCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Price (EGP)
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => onChange('price', e.target.value)}
              required
            />
          </label>
          <label>
            Original price (EGP)
            <input
              type="number"
              min="0"
              value={form.originalPrice}
              onChange={(e) => onChange('originalPrice', e.target.value)}
            />
          </label>
          <label>
            Quantity in stock
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={(e) => onChange('quantity', e.target.value)}
            />
          </label>
          <label>
            Display order
            <input
              type="number"
              min="1"
              placeholder="Auto if blank"
              value={form.displayOrder}
              onChange={(e) => onChange('displayOrder', e.target.value)}
            />
          </label>
          <label>
            Badge
            <select value={form.badge} onChange={(e) => onChange('badge', e.target.value)}>
              <option value="">None</option>
              <option value="Deal">Deal</option>
              <option value="Best seller">Best seller</option>
            </select>
          </label>
          <label>
            Photo URL
            <input value={form.image} onChange={(e) => onChange('image', e.target.value)} />
          </label>
        </div>
        <label style={{ marginTop: 14 }}>
          Description
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </label>
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn">
            {editingId ? 'Save changes' : 'Create product'}
          </button>
          {editingId ? (
            <button type="button" className="admin-btn admin-btn-ghost" onClick={cancelEdit}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-card">
        <h2>Catalog ({sorted.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Photo</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((product) => (
                <tr key={product.id}>
                  <td>{product.displayOrder}</td>
                  <td>
                    <img src={product.image} alt={product.title} />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-ghost"
                        onClick={() => startEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => onDelete(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
