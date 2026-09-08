import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatPrice, getProductById, getSizeSurcharge } from '../data/products'
import { fetchProduct } from '../services/api'
import { mapProductDto } from '../services/mapDto'
import { useCart } from '../context/CartContext'
import { useAdminData } from '../context/AdminDataContext'
import './ProductPage.css'

export default function ProductPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { getEffectiveDiscountById } = useAdminData()
  const [product, setProduct] = useState(() => getProductById(id))
  const [loadedId, setLoadedId] = useState(id)
  const [colorOverride, setColorOverride] = useState(null)
  const [sizeOverride, setSizeOverride] = useState(null)

  useEffect(() => {
    fetchProduct(id)
      .then(({ data }) => setProduct(mapProductDto(data)))
      .catch(() => setProduct(getProductById(id)))
  }, [id])

  // Reset the variant selection when navigating to a different product. This
  // adjusts state during render (React's documented pattern for "reset on
  // prop change") instead of an effect, so it doesn't cost an extra render.
  if (id !== loadedId) {
    setLoadedId(id)
    setColorOverride(null)
    setSizeOverride(null)
  }

  const selectedColor = colorOverride ?? product?.colors?.[0]?.name ?? null
  const selectedSize = sizeOverride ?? product?.sizes?.[0] ?? null

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

  const selectedSizeIndex = hasSizes ? product.sizes.indexOf(selectedSize) : -1
  const sizeSurcharge = getSizeSurcharge(product.price, selectedSizeIndex)
  const priceWithSize = product.price + sizeSurcharge
  const originalWithSize = product.originalPrice + sizeSurcharge

  const discount = getEffectiveDiscountById(product.id)
  const shownPrice = discount ? Math.round(priceWithSize * (1 - discount.percentage / 100)) : priceWithSize
  const wasPrice = discount ? priceWithSize : originalWithSize
  const cartProduct = { ...product, price: shownPrice }

  return (
    <div className="product-page">
      <div className="product-gallery">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <p className="product-cat">{product.category}</p>
        <h1>{product.title}</h1>
        <p className="product-price-row">
          <span className="product-amount">{formatPrice(shownPrice)}</span>
          {wasPrice > shownPrice ? <s className="product-was">{formatPrice(wasPrice)}</s> : null}
          {discount ? <span className="product-discount-tag">-{discount.percentage}%</span> : null}
        </p>
        {sizeSurcharge > 0 ? (
          <p className="product-size-note">Price includes +{formatPrice(sizeSurcharge)} for the {selectedSize} size.</p>
        ) : null}
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
                    onClick={() => setColorOverride(color.name)}
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
                {product.sizes.map((size, index) => {
                  const surcharge = getSizeSurcharge(product.price, index)
                  return (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={selectedSize === size}
                      className={`size-option ${selectedSize === size ? 'is-selected' : ''}`}
                      onClick={() => setSizeOverride(size)}
                    >
                      {size}
                      {surcharge > 0 ? <span className="size-option-delta"> +{formatPrice(surcharge)}</span> : null}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" className="primary-btn" onClick={() => addItem(cartProduct, 1, variant)}>
          Add to bag
        </button>
        <Link className="buy-btn" to="/checkout" onClick={() => addItem(cartProduct, 1, variant)}>
          Buy now
        </Link>
      </div>
    </div>
  )
}
