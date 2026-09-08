import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { categories, getProductsByCategory, searchProducts } from '../data/products'
import { fetchProducts } from '../services/api'
import { mapProductDto } from '../services/mapDto'
import ProductCard from '../components/products/ProductCard'
import './ProductPage.css'

export default function ListingPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const category = slug || params.get('category') || 'all'
  const [items, setItems] = useState(() =>
    query ? searchProducts(query, category) : getProductsByCategory(category),
  )
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    fetchProducts({ q: query, category, page: 1, pageSize: 24 })
      .then(({ data, meta: next }) => {
        setItems(data.map(mapProductDto))
        setMeta(next)
      })
      .catch(() => {
        setItems(query ? searchProducts(query, category) : getProductsByCategory(category))
      })
  }, [query, category])

  const categoryLabel = categories.find((item) => item.slug === category)?.label
  const heading = query
    ? `Results for “${query}”`
    : category === 'bestsellers'
      ? 'Top figures'
      : categoryLabel || 'All figures'

  return (
    <div className="listing-page">
      <h1>{heading}</h1>
      <p className="muted">{meta ? `${meta.total} results` : `${items.length} results`}</p>
      <div className="product-grid">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
