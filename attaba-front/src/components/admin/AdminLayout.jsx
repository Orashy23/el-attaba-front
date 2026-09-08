import { NavLink } from 'react-router-dom'
import './AdminLayout.css'

const TABS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/discounts', label: 'Discounts' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/audit-log', label: 'Audit log' },
]

export default function AdminLayout({ title, description, children }) {
  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <p className="admin-eyebrow">Admin</p>
          <h1>{title}</h1>
          {description ? <p className="admin-description">{description}</p> : null}
        </header>

        <nav className="admin-tabs" aria-label="Admin sections">
          {TABS.map((tab) => (
            <NavLink key={tab.to} to={tab.to} end={tab.end} className="admin-tab">
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
