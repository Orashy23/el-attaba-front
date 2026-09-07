import { createHmac, timingSafeEqual } from 'node:crypto'
import { sendError } from './dtos.js'
import { log } from './logger.js'

const SECRET = process.env.JWT_SECRET || 'figures-dev-secret-change-me'

function b64url(input) {
  return Buffer.from(input).toString('base64url')
}

export function signToken(payload, ttlMs = 7 * 24 * 60 * 60 * 1000) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(JSON.stringify({ ...payload, exp: Date.now() + ttlMs }))
  const sig = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

export function verifyToken(token) {
  const parts = String(token || '').split('.')
  if (parts.length !== 3) return null
  const [header, body, sig] = parts
  const expected = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function requireAuth(store) {
  return (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    const payload = verifyToken(token)
    if (!payload) {
      log('warn', 'auth_rejected', { path: req.path })
      return sendError(res, 401, 'UNAUTHENTICATED', 'Sign in required')
    }
    const user = store.users.find((item) => item.id === payload.sub)
    if (!user) return sendError(res, 401, 'UNAUTHENTICATED', 'Account no longer exists')
    req.user = user
    next()
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, 'FORBIDDEN', 'Not allowed')
    }
    next()
  }
}
