import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatPrice, getProductById } from '../data/products'
import { fetchProduct } from '../services/api'
import { mapProductDto } from '../services/mapDto'
import { useCart } from '../context/CartContext'
import './ProductPage.css'

export default function ProductPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(() => getProductById(id))

  useEffect(() => {
    fetchProduct(id)
      .then(({ data }) => setProduct(mapProductDto(data)))
      .catch(() => setProduct(getProductById(id)))
  }, [id])

  if (!product) {
    return (
      <div className="page-wrap">
        <h1>Product not found</h1>
        <Link to="/">Back to shopping</Link>
      </div>
    )
  }

  return (
    <div className="product-page">
      <div className="product-gallery">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <p className="product-cat">{product.category}</p>
        <h1>{product.title}</h1>
        <p className="product-amount">{formatPrice(product.price)}</p>
        {product.originalPrice > product.price ? (
          <p className="product-was">{formatPrice(product.originalPrice)}</p>
        ) : null}
        <p className="product-copy">{product.description}</p>
        <button type="button" className="primary-btn" onClick={() => addItem(product)}>
          Add to bag
        </button>
        <Link className="ghost-btn" to="/checkout" onClick={() => addItem(product)}>
          Buy now
        </Link>
      </div>
    </div>
  )
}
