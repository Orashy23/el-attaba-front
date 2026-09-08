import { Link } from 'react-router-dom'
import { formatPrice } from '../../data/products'
import { useAdminData } from '../../context/AdminDataContext'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { getEffectiveDiscountById } = useAdminData()
  const discount = getEffectiveDiscountById(product.id)
  const shownPrice = discount ? Math.round(product.price * (1 - discount.percentage / 100)) : product.price
  const wasPrice = discount ? product.price : product.originalPrice

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        {discount ? <span className="tag tag-sale">-{discount.percentage}%</span> : null}
        {!discount && product.badge === 'Deal' ? <span className="tag tag-sale">Sale</span> : null}
        {!discount && product.badge === 'Best seller' ? <span className="tag tag-top">Top</span> : null}
        <img src={product.image} alt={product.title} />
      </Link>
      <Link to={`/product/${product.id}`} className="product-meta">
        <h3>{product.title}</h3>
        <p>
          <span className="price-now">{formatPrice(shownPrice)}</span>
          {wasPrice > shownPrice ? <s className="price-was">{formatPrice(wasPrice)}</s> : null}
        </p>
      </Link>
    </article>
  )
}
