import { Link } from 'react-router-dom'
import { collectionLinks } from '../../data/products'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">FIGURES</div>
      <div className="footer-grid">
        <div>
          <h3>Worlds</h3>
          {collectionLinks.map((item) => (
            <Link key={item.id} to={`/category/${item.slug}`}>
              {item.label}
            </Link>
          ))}
          <Link to="/category/all">All figures</Link>
          <Link to="/category/bestsellers">Top figures</Link>
          <Link to="/category/deals">Deals</Link>
        </div>
        <div>
          <h3>Help</h3>
          <Link to="/account">Account</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/cart">Bag</Link>
        </div>
        <div>
          <h3>Cairo</h3>
          <p>Collectible figures and pops. Prices in EGP.</p>
        </div>
      </div>
    </footer>
  )
}
