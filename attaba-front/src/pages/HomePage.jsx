import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHomeRows, getProductsByCategory, products as localProducts } from '../data/products'
import { fetchProducts } from '../services/api'
import { mapProductDto } from '../services/mapDto'
import ProductCard from '../components/products/ProductCard'
import './HomePage.css'

const marqueeText = "Figures · Funko · Marvel · Anime · Sports · Movies  FIGURES.  "

function rowsFrom(list) {
  const byCat = (id) => list.filter((item) => item.category === id)
  return [
    { title: 'Marvel', href: '/category/marvel', items: byCat('marvel') },
    { title: 'Anime', href: '/category/anime', items: byCat('anime') },
    { title: 'Movies & TV', href: '/category/movies', items: byCat('movies') },
    { title: 'Sports', href: '/category/sports', items: byCat('sports') },
    { title: 'Gaming', href: '/category/gaming', items: byCat('gaming') },
  ]
}

export default function HomePage() {
  const [catalog, setCatalog] = useState(localProducts)

  useEffect(() => {
    fetchProducts({ pageSize: 48 })
      .then(({ data }) => setCatalog(data.map(mapProductDto)))
      .catch(() => setCatalog(localProducts))
  }, [])

  const deals = catalog.filter((item) => item.badge === 'Deal')
  const rows = catalog.length ? rowsFrom(catalog) : getHomeRows()
  const dealItems = deals.length ? deals : getProductsByCategory('deals')

  return (
    <div className="home-page">
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=2400&q=80"
          alt="Action figure collection"
        />
        <div className="hero-copy">
          <p>New drops</p>
          <h1>FIGURES</h1>
        </div>
      </section>

      <div className="hero-spacer" />

      <div className="marquee" aria-hidden="true">
        <div>
          <span>{marqueeText.repeat(6)}</span>
          <span>{marqueeText.repeat(6)}</span>
        </div>
      </div>

      <section className="home-section">
        <div className="section-head">
          <h2>Deals</h2>
          <Link to="/category/deals">See all</Link>
        </div>
        <div className="home-grid">
          {dealItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {rows.map((row) => (
        <section className="home-section" key={row.title}>
          <div className="section-head">
            <h2>{row.title}</h2>
            <Link to={row.href}>See all</Link>
          </div>
          <div className="home-grid">
            {row.items.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
