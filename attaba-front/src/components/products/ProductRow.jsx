import { useRef } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import './ProductRow.css'

export default function ProductRow({ title, href, items }) {
  const scrollerRef = useRef(null)

  function scrollByDir(dir) {
    scrollerRef.current?.scrollBy({ left: dir * 480, behavior: 'smooth' })
  }

  if (!items?.length) return null

  return (
    <section className="product-row">
      <div className="product-row-head">
        <h2>{title}</h2>
        {href ? <Link to={href}>See all</Link> : null}
      </div>
      <div className="product-row-frame">
        <button type="button" className="row-arrow left" onClick={() => scrollByDir(-1)} aria-label={`Scroll ${title} left`}>
          ‹
        </button>
        <div className="product-row-scroller" ref={scrollerRef}>
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <button type="button" className="row-arrow right" onClick={() => scrollByDir(1)} aria-label={`Scroll ${title} right`}>
          ›
        </button>
      </div>
    </section>
  )
}
