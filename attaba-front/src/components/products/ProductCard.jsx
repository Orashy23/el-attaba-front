import { Link } from 'react-router-dom'
import { formatPrice } from '../../data/products'
import './ProductCard.css'

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-media">
        {product.badge === 'Deal' ? <span>Sale</span> : null}
        {product.badge === 'Best seller' ? <span>Top</span> : null}
        <img src={product.image} alt={product.title} />
      </Link>
      <Link to={`/product/${product.id}`} className="product-meta">
        <h3>{product.title}</h3>
        <p>
          {formatPrice(product.price)}
          {product.originalPrice > product.price ? <s>{formatPrice(product.originalPrice)}</s> : null}
        </p>
      </Link>
    </article>
  )
}
