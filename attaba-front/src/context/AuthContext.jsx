import { createContext, useContext, useMemo, useState } from 'react'
import { getStoredToken, loginRequest, setStoredToken } from '../services/api'

const AuthContext = createContext(null)

function tokenStillValid(token) {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return Boolean(payload.exp && Date.now() < payload.exp)
  } catch {
    return false
  }
}

function readUser() {
  try {
    const raw = localStorage.getItem('figures.user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = getStoredToken()
    return tokenStillValid(stored) ? stored : null
  })
  const [user, setUser] = useState(() => (tokenStillValid(getStoredToken()) ? readUser() : null))

  const value = useMemo(() => {
    async function login(email, password) {
      const { data } = await loginRequest(email, password)
      setToken(data.token)
      setUser(data.user)
      setStoredToken(data.token)
      localStorage.setItem('figures.user', JSON.stringify(data.user))
      return data.user
    }

    function logout() {
      setToken(null)
      setUser(null)
      setStoredToken(null)
      localStorage.removeItem('figures.user')
    }

    return {
      token,
      user,
      isAuthed: Boolean(token && user),
      login,
      logout,
    }
  }, [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
