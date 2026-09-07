import { Link } from 'react-router-dom'
import { categories } from '../../data/products'
import './CategoryDrawer.css'

export default function CategoryDrawer({ open, onClose }) {
  if (!open) return null

  return (
    <div className="drawer-root">
      <button type="button" className="drawer-backdrop" aria-label="Close menu" onClick={onClose} />
      <aside className="drawer-panel" role="dialog" aria-label="Menu">
        <div className="drawer-head">
          <strong>FIGURES.</strong>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <h2>Shop by world</h2>
        <ul>
          {categories
            .filter((item) => item.id !== 'all')
            .map((item) => (
              <li key={item.id}>
                <Link to={`/category/${item.slug}`} onClick={onClose}>
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </aside>
    </div>
  )
}
