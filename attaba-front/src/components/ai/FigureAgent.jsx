import { Link, useLocation } from 'react-router-dom'
import './FigureAgent.css'

export default function FigureAgent() {
  const location = useLocation()
  if (location.pathname === '/assistant') return null

  return (
    <Link to="/assistant" className="agent-fab" aria-label="Ask Jarvis - open assistant chat">
      <svg
        className="agent-fab-bot"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line className="bot-antenna-stem" x1="16" y1="6" x2="16" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <g className="bot-antenna">
          <circle cx="16" cy="2" r="2" fill="currentColor" />
        </g>
        <g className="bot-head">
          <rect x="5" y="7" width="22" height="18" rx="7" fill="#2a2620" stroke="currentColor" strokeWidth="1.5" />
          <circle className="bot-eye" cx="12.5" cy="16" r="2.6" fill="currentColor" />
          <circle className="bot-eye" cx="19.5" cy="16" r="2.6" fill="currentColor" />
          <path className="bot-mouth" d="M12 21h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </svg>
      <span className="agent-fab-label">Ask Jarvis</span>
    </Link>
  )
}
