import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { askAgent } from '../../services/api'
import './FigureAgent.css'

export default function FigureAgent() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      text: 'I’m the FIGURES. finder. Ask for a Marvel shelf, an anime pick, or a figure under EGP 1000.',
    },
  ])
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send(event) {
    event.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    setMessages((current) => [...current, { role: 'you', text }])
    setBusy(true)
    try {
      const { data } = await askAgent(text)
      setMessages((current) => [
        ...current,
        { role: 'agent', text: data.text, products: data.products, provider: data.provider },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: 'agent', text: error.message || 'The assistant is unavailable right now.' },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="figure-agent">
      {open ? (
        <section className="agent-panel" aria-label="Figure finder">
          <header>
            <div>
              <strong>Figure finder</strong>
              <p>Ask for a pick from the shelf</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
              ×
            </button>
          </header>
          <div className="agent-thread">
            {messages.map((item, index) => (
              <div key={index} className={`agent-msg is-${item.role}`}>
                <p>{item.text}</p>
                {item.products?.length ? (
                  <ul>
                    {item.products.map((product) => (
                      <li key={product.id}>
                        <Link to={`/product/${product.id}`} onClick={() => setOpen(false)}>
                          {product.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            {busy ? <p className="agent-busy">Looking through the catalog…</p> : null}
            <div ref={endRef} />
          </div>
          <form onSubmit={send}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="e.g. Marvel under 1500"
              maxLength={500}
            />
            <button type="submit" disabled={busy}>
              Send
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="agent-fab"
        aria-expanded={open}
        aria-label="Open figure finder"
        onClick={() => setOpen((value) => !value)}
      >
        AI
      </button>
    </div>
  )
}
