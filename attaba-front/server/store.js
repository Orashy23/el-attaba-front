import { products } from '../src/data/products.js'

export function createStore() {
  return {
    products,
    productCache: { at: 0, data: null },
    cacheTtlMs: 60_000,
    users: [
      {
        id: 'u_customer',
        email: 'customer@figures.test',
        password: 'password123',
        role: 'customer',
        name: 'Collect Customer',
      },
      {
        id: 'u_admin',
        email: 'admin@figures.test',
        password: 'password123',
        role: 'admin',
        name: 'Figures Admin',
      },
    ],
    orders: new Map(),
    idempotency: new Map(),
    inflight: new Map(),
    rateHits: new Map(),
  }
}

export function getCachedProducts(store) {
  const now = Date.now()
  if (store.productCache.data && now - store.productCache.at < store.cacheTtlMs) {
    return { products: store.productCache.data, cacheHit: true }
  }
  store.productCache = { at: now, data: store.products }
  return { products: store.products, cacheHit: false }
}
