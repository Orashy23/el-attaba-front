/**
 * Client-side stand-in for the backend's UserDiscount entity (FirstPurchase /
 * PostOrderWindow) — this pass is frontend-only, so eligibility state lives in
 * localStorage per user id instead of a database row. The resolution order
 * mirrors the spec: unused FirstPurchase, then an unexpired PostOrderWindow.
 */

const KEY_PREFIX = 'figures.userDiscounts.'
const POST_ORDER_PERCENTAGE = 15
const POST_ORDER_WINDOW_MS = 72 * 60 * 60 * 1000

function readState(userId) {
  if (!userId) return { ordersCompleted: 0, postOrderWindow: null }
  try {
    const raw = localStorage.getItem(KEY_PREFIX + userId)
    return raw ? JSON.parse(raw) : { ordersCompleted: 0, postOrderWindow: null }
  } catch {
    return { ordersCompleted: 0, postOrderWindow: null }
  }
}

function writeState(userId, state) {
  if (!userId) return
  try {
    localStorage.setItem(KEY_PREFIX + userId, JSON.stringify(state))
  } catch {
    /* private mode / storage unavailable — discount just won't persist */
  }
}

/** First an unused first-order discount, then an unexpired post-order window. */
export function getBestUserDiscount(userId) {
  if (!userId) return null
  const state = readState(userId)

  if (state.ordersCompleted === 0) {
    return { percentage: 15, source: 'first-order' }
  }

  if (state.postOrderWindow && Date.now() < state.postOrderWindow.expiresAt) {
    return { percentage: state.postOrderWindow.percentage, source: 'post-order', expiresAt: state.postOrderWindow.expiresAt }
  }

  return null
}

/** Call once an order has actually been placed successfully. */
export function recordOrderCompleted(userId) {
  if (!userId) return
  const state = readState(userId)
  writeState(userId, {
    ordersCompleted: state.ordersCompleted + 1,
    postOrderWindow: { percentage: POST_ORDER_PERCENTAGE, expiresAt: Date.now() + POST_ORDER_WINDOW_MS },
  })
}

export function getPostOrderWindow(userId) {
  if (!userId) return null
  const state = readState(userId)
  if (state.postOrderWindow && Date.now() < state.postOrderWindow.expiresAt) {
    return state.postOrderWindow
  }
  return null
}
