import express from 'express'
import { requireAuth, requireRole, signToken } from './auth.js'
import { sendError, sendOk, toProductDto, toUserDto, toOrderDto } from './dtos.js'
import { getCachedProducts } from './store.js'
import { getOwnedOrder, listOrdersFor, placeOrder } from './checkout.js'
import { askAssistant } from './assistant.js'
import { log } from './logger.js'

function rateLimit(store, { windowMs, max, name }) {
  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'local'
    const now = Date.now()
    const key = `${name}:${ip}`
    const recent = (store.rateHits.get(key) || []).filter((time) => now - time < windowMs)
    if (recent.length >= max) {
      return sendError(res, 429, 'RATE_LIMITED', 'Too many requests, try again shortly')
    }
    recent.push(now)
    store.rateHits.set(key, recent)
    next()
  }
}

export function createApp(store) {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '32kb' }))

  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      log('info', 'http', {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        ms: Date.now() - start,
      })
    })
    next()
  })

  const v1 = express.Router()

  v1.get('/health', (_req, res) => {
    sendOk(res, { ok: true, version: 'v1' })
  })

  v1.get('/products', (req, res) => {
    const { products, cacheHit } = getCachedProducts(store)
    const q = String(req.query.q || '').trim().toLowerCase()
    const category = String(req.query.category || 'all')
    const page = Math.max(1, Number(req.query.page) || 1)
    const pageSize = Math.min(48, Math.max(1, Number(req.query.pageSize) || 12))

    let list = products
    if (category === 'deals') list = list.filter((item) => item.badge === 'Deal')
    else if (category === 'bestsellers') {
      list = list
        .filter((item) => item.badge === 'Best seller' || item.reviews >= 800)
        .sort((a, b) => b.reviews - a.reviews)
    } else if (category && category !== 'all') {
      list = list.filter((item) => item.category === category)
    }
    if (q) {
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      )
    }

    const start = (page - 1) * pageSize
    const slice = list.slice(start, start + pageSize)
    res.setHeader('X-Cache', cacheHit ? 'HIT' : 'MISS')
    res.setHeader('Cache-Control', 'public, max-age=30')
    sendOk(res, slice.map(toProductDto), {
      page,
      pageSize,
      total: list.length,
      cache: cacheHit ? 'hit' : 'miss',
    })
  })

  v1.get('/products/:id', (req, res) => {
    const { products } = getCachedProducts(store)
    const product = products.find((item) => item.id === req.params.id)
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found')
    sendOk(res, toProductDto(product))
  })

  v1.post('/auth/login', rateLimit(store, { windowMs: 60_000, max: 10, name: 'login' }), (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase()
    const password = String(req.body?.password || '')
    if (!email.includes('@') || password.length < 6) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Valid email and password required')
    }
    const user = store.users.find((item) => item.email === email && item.password === password)
    if (!user) {
      log('warn', 'login_failed', { email })
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Email or password is wrong')
    }
    const token = signToken({ sub: user.id, role: user.role })
    log('info', 'login_ok', { userId: user.id, role: user.role })
    sendOk(res, { token, user: toUserDto(user) })
  })

  v1.get('/me', requireAuth(store), (req, res) => {
    sendOk(res, toUserDto(req.user))
  })

  v1.post('/orders', requireAuth(store), async (req, res) => {
    const key = req.get('Idempotency-Key') || req.body?.idempotencyKey
    const items = Array.isArray(req.body?.items) ? req.body.items : []
    const address = String(req.body?.address || '').trim()
    const phone = String(req.body?.phone || '').trim()
    const name = String(req.body?.name || '').trim()
    if (!items.length || !address || !phone || !name) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Name, address, phone, and items are required')
    }
    try {
      const order = await placeOrder(store, {
        user: req.user,
        idempotencyKey: key,
        items,
        address,
        phone,
        name,
        simulateFailure: Boolean(req.body?.simulateFailure),
      })
      res.status(201)
      sendOk(res, toOrderDto(order))
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') {
        return sendError(res, 400, error.code, error.message)
      }
      if (error.code === 'COMPENSATION_REQUIRED') {
        return res.status(409).json({
          error: {
            code: 'COMPENSATION_REQUIRED',
            message: error.message,
            details: [],
          },
          data: toOrderDto(error.order),
        })
      }
      log('error', 'order_failed', { message: error.message })
      sendError(res, 500, 'INTERNAL', 'Could not place order')
    }
  })

  v1.get('/orders', requireAuth(store), (req, res) => {
    sendOk(res, listOrdersFor(store, req.user))
  })

  v1.get('/orders/:id', requireAuth(store), (req, res) => {
    const result = getOwnedOrder(store, req.user, req.params.id)
    if (result.status === 404) return sendError(res, 404, 'NOT_FOUND', 'Order not found')
    if (result.status === 403) return sendError(res, 403, 'FORBIDDEN', 'You do not own this order')
    sendOk(res, toOrderDto(result.order))
  })

  v1.get('/admin/orders', requireAuth(store), requireRole('admin'), (req, res) => {
    sendOk(res, listOrdersFor(store, req.user))
  })

  v1.post('/assistant', rateLimit(store, { windowMs: 60_000, max: 20, name: 'assistant' }), async (req, res) => {
    try {
      const data = await askAssistant(store, req.body?.message)
      sendOk(res, data)
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') {
        return sendError(res, 400, error.code, error.message)
      }
      log('error', 'assistant_failed', { message: error.message })
      sendError(res, 500, 'INTERNAL', 'Assistant is unavailable')
    }
  })

  app.use('/v1', v1)

  app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid JSON body')
    }
    log('error', 'unhandled', { errMessage: err.message })
    sendError(res, 500, 'INTERNAL', 'Unexpected error')
  })

  return app
}
