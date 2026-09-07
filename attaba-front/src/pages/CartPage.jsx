import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import './ProductPage.css'

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem, count } = useCart()

  if (!items.length) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h1>Your bag is empty</h1>
          <p className="muted">Browse the shop and add something you like.</p>
          <Link className="primary-btn" to="/">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-layout">
        <section className="page-card">
          <h1>Your bag</h1>
          {items.map((item) => (
            <article key={item.id} className="cart-item">
              <img src={item.image} alt="" />
              <div>
                <h2>
                  <Link to={`/product/${item.id}`}>{item.title}</Link>
                </h2>
                <p className="in-stock">In stock</p>
                <div className="qty-row">
                  <label>
                    Qty
                    <select
                      value={item.qty}
                      onChange={(event) => updateQty(item.id, Number(event.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
              <strong>{formatPrice(item.price * item.qty)}</strong>
            </article>
          ))}
        </section>
        <aside className="cart-summary">
          <p>
            Subtotal ({count} items): <strong>{formatPrice(subtotal)}</strong>
          </p>
          <Link className="primary-btn" to="/checkout">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  )
}
