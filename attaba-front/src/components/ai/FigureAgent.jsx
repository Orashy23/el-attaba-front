import { Link, useLocation } from 'react-router-dom'
import './FigureAgent.css'

export default function FigureAgent() {
  const location = useLocation()
  if (location.pathname === '/assistant') return null

  return (
    <Link to="/assistant" className="agent-fab" aria-label="Open figure finder chat">
      AI
    </Link>
  )
}
