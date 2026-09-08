import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

function lineId(productId, color, size) {
  return [productId, color || '', size || ''].join('::')
}

function snapshotLine(product, qty, { color, size } = {}) {
  return {
    lineId: lineId(product.id, color, size),
    id: product.id,
    title: product.title,
    image: product.image,
    qty,
    color: color ?? null,
    size: size ?? null,
    unitPriceSnapshot: product.price,
    price: product.price,
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0)
    const subtotal = items.reduce(
      (sum, item) => sum + (item.unitPriceSnapshot ?? item.price) * item.qty,
      0,
    )

    function addItem(product, qty = 1, variant = {}) {
      const id = lineId(product.id, variant.color, variant.size)
      setItems((current) => {
        const existing = current.find((item) => item.lineId === id)
        if (existing) {
          return current.map((item) =>
            item.lineId === id ? { ...item, qty: item.qty + qty } : item,
          )
        }
        return [...current, snapshotLine(product, qty, variant)]
      })
    }

    function updateQty(id, qty) {
      setItems((current) =>
        qty <= 0
          ? current.filter((item) => item.lineId !== id)
          : current.map((item) => (item.lineId === id ? { ...item, qty } : item)),
      )
    }

    function removeItem(id) {
      setItems((current) => current.filter((item) => item.lineId !== id))
    }

    function clearCart() {
      setItems([])
    }

    return { items, count, subtotal, addItem, updateQty, removeItem, clearCart }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
