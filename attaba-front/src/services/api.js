const TOKEN_KEY = 'figures.token'

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* private mode */
  }
}

export async function api(path, { method = 'GET', body, token, idempotencyKey } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const auth = token ?? getStoredToken()
  if (auth) headers.Authorization = `Bearer ${auth}`
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey

  const response = await fetch(`/api/v1${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401) {
      setStoredToken(null)
      try {
        localStorage.removeItem('figures.user')
      } catch {
        /* ignore */
      }
    }
    const error = new Error(json.error?.message || 'Request failed')
    error.code = json.error?.code || 'UNKNOWN'
    error.status = response.status
    error.payload = json
    throw error
  }
  return json
}

export function loginRequest(email, password) {
  return api('/auth/login', { method: 'POST', body: { email, password } })
}

export function fetchProducts({ q = '', category = 'all', page = 1, pageSize = 24 } = {}) {
  const params = new URLSearchParams({ q, category, page: String(page), pageSize: String(pageSize) })
  return api(`/products?${params}`)
}

export function fetchProduct(id) {
  return api(`/products/${id}`)
}

export function fetchOrders(token) {
  return api('/orders', { token })
}

export function placeOrderRequest({ token, idempotencyKey, payload }) {
  return api('/orders', { method: 'POST', token, idempotencyKey, body: payload })
}

export function askAgent(message) {
  return api('/assistant', { method: 'POST', body: { message } })
}
