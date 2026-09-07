import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

function snapshotLine(product, qty) {
  return {
    id: product.id,
    title: product.title,
    image: product.image,
    qty,
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

    function addItem(product, qty = 1) {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id)
        if (existing) {
          return current.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + qty } : item,
          )
        }
        return [...current, snapshotLine(product, qty)]
      })
    }

    function updateQty(id, qty) {
      setItems((current) =>
        qty <= 0
          ? current.filter((item) => item.id !== id)
          : current.map((item) => (item.id === id ? { ...item, qty } : item)),
      )
    }

    function removeItem(id) {
      setItems((current) => current.filter((item) => item.id !== id))
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
