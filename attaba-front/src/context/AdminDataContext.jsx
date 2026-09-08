import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { products as seedProducts } from '../data/products'

const AdminDataContext = createContext(null)

let nextAuditSeq = 1
let nextProductSeq = 1000

function isWindowActive(startsAt, endsAt) {
  if (!startsAt || !endsAt) return false
  const now = Date.now()
  return now >= new Date(startsAt).getTime() && now <= new Date(endsAt).getTime()
}

/**
 * Mirrors the Application-layer validator from the backend spec:
 * ends_at must be after starts_at, and the percentage must be 0–100.
 * Throws so callers (the admin forms) can surface the message inline.
 */
export function validateDiscountWindow({ percentage, startsAt, endsAt }) {
  const pct = Number(percentage)
  if (Number.isNaN(pct) || pct < 0 || pct > 100) {
    throw new Error('Discount must be between 0 and 100.')
  }
  if (!startsAt || !endsAt) {
    throw new Error('Start and end times are required.')
  }
  if (new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
    throw new Error('End time must be after start time.')
  }
  return pct
}

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState(() =>
    seedProducts.map((product) => ({
      ...product,
      discountPercentage: null,
      discountStartsAt: null,
      discountEndsAt: null,
    })),
  )
  const [storewideDiscount, setStorewideDiscount] = useState(null) // { percentage, startsAt, endsAt } | null
  const [auditLog, setAuditLog] = useState([])

  const addAuditEntry = useCallback((actor, action, entityType, entityId, summary) => {
    setAuditLog((current) => [
      {
        id: `log_${nextAuditSeq++}`,
        at: new Date().toISOString(),
        actor: actor || 'admin',
        action,
        entityType,
        entityId,
        summary,
      },
      ...current,
    ])
  }, [])

  const createProduct = useCallback(
    (input, actor) => {
      const maxOrder = products.reduce((max, p) => Math.max(max, p.displayOrder ?? 0), 0)
      const id = `p${nextProductSeq++}`
      const product = {
        id,
        title: input.title?.trim() || 'Untitled figure',
        price: Number(input.price) || 0,
        originalPrice: Number(input.originalPrice) || Number(input.price) || 0,
        rating: 0,
        reviews: 0,
        category: input.category || 'marvel',
        badge: input.badge || null,
        image: input.image?.trim() || '',
        description: input.description?.trim() || '',
        quantity: Number.isFinite(Number(input.quantity)) ? Number(input.quantity) : 0,
        // DisplayOrder auto-increments to MAX(DisplayOrder) + 1 when left blank, per spec.
        displayOrder:
          input.displayOrder !== '' && input.displayOrder != null
            ? Number(input.displayOrder)
            : maxOrder + 1,
        sizes: [],
        colors: [],
        discountPercentage: null,
        discountStartsAt: null,
        discountEndsAt: null,
      }
      setProducts((current) => [...current, product])
      addAuditEntry(actor, 'CREATE_PRODUCT', 'Product', id, `Created "${product.title}"`)
      return product
    },
    [products, addAuditEntry],
  )

  const updateProduct = useCallback(
    (id, patch, actor) => {
      setProducts((current) =>
        current.map((product) => (product.id === id ? { ...product, ...patch } : product)),
      )
      addAuditEntry(actor, 'UPDATE_PRODUCT', 'Product', id, `Updated fields: ${Object.keys(patch).join(', ')}`)
    },
    [addAuditEntry],
  )

  const deleteProduct = useCallback(
    (id, actor) => {
      const target = products.find((product) => product.id === id)
      setProducts((current) => current.filter((product) => product.id !== id))
      addAuditEntry(actor, 'DELETE_PRODUCT', 'Product', id, `Deleted "${target?.title ?? id}"`)
    },
    [products, addAuditEntry],
  )

  const setProductDiscount = useCallback(
    (id, { percentage, startsAt, endsAt }, actor) => {
      const pct = validateDiscountWindow({ percentage, startsAt, endsAt })
      updateProduct(
        id,
        { discountPercentage: pct, discountStartsAt: startsAt, discountEndsAt: endsAt },
        actor,
      )
      addAuditEntry(actor, 'SET_PRODUCT_DISCOUNT', 'Product', id, `Set ${pct}% off from ${startsAt} to ${endsAt}`)
    },
    [updateProduct, addAuditEntry],
  )

  const clearProductDiscount = useCallback(
    (id, actor) => {
      updateProduct(id, { discountPercentage: null, discountStartsAt: null, discountEndsAt: null }, actor)
      addAuditEntry(actor, 'CLEAR_PRODUCT_DISCOUNT', 'Product', id, 'Cleared product discount')
    },
    [updateProduct, addAuditEntry],
  )

  const applyStorewideDiscount = useCallback(
    ({ percentage, startsAt, endsAt }, actor) => {
      const pct = validateDiscountWindow({ percentage, startsAt, endsAt })
      setStorewideDiscount({ percentage: pct, startsAt, endsAt })
      addAuditEntry(actor, 'SET_STOREWIDE_DISCOUNT', 'Store', 'storewide', `Set ${pct}% off from ${startsAt} to ${endsAt}`)
    },
    [addAuditEntry],
  )

  const clearStorewideDiscount = useCallback(
    (actor) => {
      setStorewideDiscount(null)
      addAuditEntry(actor, 'CLEAR_STOREWIDE_DISCOUNT', 'Store', 'storewide', 'Cleared storewide discount')
    },
    [addAuditEntry],
  )

  /** First an active per-product window, then an active storewide window — first match wins. */
  const getEffectiveDiscount = useCallback(
    (product) => {
      if (product?.discountPercentage && isWindowActive(product.discountStartsAt, product.discountEndsAt)) {
        return { percentage: product.discountPercentage, source: 'product' }
      }
      if (storewideDiscount && isWindowActive(storewideDiscount.startsAt, storewideDiscount.endsAt)) {
        return { percentage: storewideDiscount.percentage, source: 'storewide' }
      }
      return null
    },
    [storewideDiscount],
  )

  const withEffectiveDiscount = useCallback(
    (product) => {
      const discount = getEffectiveDiscount(product)
      const discountedPrice = discount
        ? Math.round(product.price * (1 - discount.percentage / 100))
        : product.price
      return { ...product, effectiveDiscount: discount, discountedPrice }
    },
    [getEffectiveDiscount],
  )

  /**
   * Storefront pages (Home/Listing/Product) read their catalog from
   * data/products.js or the mock API, not from this context's own product
   * copies — so admin discount windows are looked up by id and applied to
   * whatever price the storefront is already showing, keeping the two data
   * sources loosely coupled instead of forcing a full catalog migration.
   */
  const getEffectiveDiscountById = useCallback(
    (productId) => {
      const match = products.find((product) => product.id === productId)
      return match ? getEffectiveDiscount(match) : null
    },
    [products, getEffectiveDiscount],
  )

  const value = useMemo(
    () => ({
      products,
      storewideDiscount,
      auditLog,
      createProduct,
      updateProduct,
      deleteProduct,
      setProductDiscount,
      clearProductDiscount,
      applyStorewideDiscount,
      clearStorewideDiscount,
      getEffectiveDiscount,
      withEffectiveDiscount,
      getEffectiveDiscountById,
    }),
    [
      products,
      storewideDiscount,
      auditLog,
      createProduct,
      updateProduct,
      deleteProduct,
      setProductDiscount,
      clearProductDiscount,
      applyStorewideDiscount,
      clearStorewideDiscount,
      getEffectiveDiscount,
      withEffectiveDiscount,
      getEffectiveDiscountById,
    ],
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

export function useAdminData() {
  const context = useContext(AdminDataContext)
  if (!context) {
    throw new Error('useAdminData must be used inside AdminDataProvider')
  }
  return context
}
