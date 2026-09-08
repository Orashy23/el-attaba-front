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
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  useEffect(() => {
    fetchProduct(id)
      .then(({ data }) => setProduct(mapProductDto(data)))
      .catch(() => setProduct(getProductById(id)))
  }, [id])

  useEffect(() => {
    setSelectedColor(product?.colors?.[0]?.name ?? null)
    setSelectedSize(product?.sizes?.[0] ?? null)
  }, [product])

  if (!product) {
    return (
      <div className="page-wrap">
        <h1>Product not found</h1>
        <Link to="/">Back to shopping</Link>
      </div>
    )
  }

  const hasColors = Boolean(product.colors?.length)
  const hasSizes = Boolean(product.sizes?.length)
  const variant = { color: selectedColor, size: selectedSize }

  return (
    <div className="product-page">
      <div className="product-gallery">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <p className="product-cat">{product.category}</p>
        <h1>{product.title}</h1>
        <p className="product-price-row">
          <span className="product-amount">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price ? (
            <s className="product-was">{formatPrice(product.originalPrice)}</s>
          ) : null}
        </p>
        <p className="product-copy">{product.description}</p>

        <div className="product-options">
          {hasColors ? (
            <div className="option-group">
              <span className="option-label">
                Color: <strong>{selectedColor}</strong>
              </span>
              <div className="color-options" role="radiogroup" aria-label="Color">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    role="radio"
                    aria-checked={selectedColor === color.name}
                    aria-label={color.name}
                    title={color.name}
                    className={`color-option ${selectedColor === color.name ? 'is-selected' : ''}`}
                    style={{ background: color.hex }}
                    onClick={() => setSelectedColor(color.name)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {hasSizes ? (
            <div className="option-group">
              <span className="option-label">
                Size: <strong>{selectedSize}</strong>
              </span>
              <div className="size-options" role="radiogroup" aria-label="Size">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    role="radio"
                    aria-checked={selectedSize === size}
                    className={`size-option ${selectedSize === size ? 'is-selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="primary-btn" onClick={() => addItem(product, 1, variant)}>
          Add to bag
        </button>
        <Link className="buy-btn" to="/checkout" onClick={() => addItem(product, 1, variant)}>
          Buy now
        </Link>
      </div>
    </div>
  )
}
