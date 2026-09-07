import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './ProductPage.css'

export default function AccountPage() {
  const { isAuthed, user, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('customer@figures.test')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const next = location.state?.from || '/checkout'

  async function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email, password)
      navigate(next, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (isAuthed) {
    return (
      <div className="simple-page">
        <div className="account-panel">
          <h1>Account</h1>
          <p>
            Signed in as <strong>{user.email}</strong> ({user.role})
          </p>
          <p className="muted">JWT is kept in memory and localStorage for this demo. Production would use an httpOnly cookie.</p>
          <p>
            <Link to="/orders">Your orders</Link>
          </p>
          <button type="button" className="primary-btn" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="simple-page">
      <div className="account-panel">
        <h1>Account</h1>
        <p className="muted">Demo: customer@figures.test / password123 — or admin@figures.test</p>
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="primary-btn" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p>
          <Link to="/">Continue shopping</Link>
        </p>
      </div>
    </div>
  )
}
