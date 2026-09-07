import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { collectionLinks } from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.6-3 4-4.5 7-4.5S17.4 16 19 19" />
    </svg>
  )
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  )
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  )
}

export default function Header({ onOpenMenu }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { count } = useCart()
  const { isAuthed } = useAuth()
  const [query, setQuery] = useState('')
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const collectionsRef = useRef(null)

  useEffect(() => {
    setCollectionsOpen(false)
    if (location.pathname === '/search') {
      setQuery(new URLSearchParams(location.search).get('q') || '')
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    function onPointerDown(event) {
      if (!collectionsRef.current?.contains(event.target)) {
        setCollectionsOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    navigate(`/search?${params.toString()}`)
  }

  return (
    <header className="site-header">
      <div className="header-bar">
        <button type="button" className="menu-btn" onClick={onOpenMenu} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>

        <Link to="/" className="brand">
          FIGURES.
        </Link>

        <nav className="main-nav" aria-label="Shop">
          <NavLink to="/search">New drops</NavLink>

          <div
            className={`nav-dropdown ${collectionsOpen ? 'is-open' : ''}`}
            ref={collectionsRef}
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button
              type="button"
              className="collections-trigger"
              aria-expanded={collectionsOpen}
              aria-haspopup="menu"
              onClick={() => setCollectionsOpen(true)}
            >
              Shop by world
              <svg viewBox="0 0 12 8" aria-hidden="true">
                <path d="M1 1.5 L6 6.5 L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <div className="dropdown-panel" role="menu">
              {collectionLinks.map((item) => (
                <Link key={item.id} to={`/category/${item.slug}`} role="menuitem">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <NavLink to="/search">Top figures</NavLink>
          <NavLink to="/category/deals" className="sale-link">
            Deals
          </NavLink>
        </nav>

        <div className="icon-nav">
          <Link to="/account" aria-label={isAuthed ? 'Account signed in' : 'Account'}>
            <IconUser />
          </Link>
          <Link to="/orders" aria-label="Saved">
            <IconHeart />
          </Link>
          <Link to="/cart" className="bag-link" aria-label={`Cart, ${count} items`}>
            <IconBag />
            {count > 0 ? <span>{count}</span> : null}
          </Link>
        </div>
      </div>

      <form className="header-search" onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="site-search">
          Search
        </label>
        <IconSearch />
        <input
          id="site-search"
          type="search"
          placeholder="Search figures, Marvel, anime..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </header>
  )
}
