import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CategoryDrawer from './CategoryDrawer'
import FigureAgent from '../ai/FigureAgent'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell" id="top">
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <CategoryDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <FigureAgent />
    </div>
  )
}
