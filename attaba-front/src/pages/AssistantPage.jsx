import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { askAgent } from '../services/api'
import './AssistantPage.css'

export default function AssistantPage() {
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
  }, [messages])

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
    <div className="assistant-page">
      <header className="assistant-head">
        <p>Figure finder</p>
        <h1>Chat</h1>
        <span>Ask for a pick from the shelf</span>
      </header>

      <div className="assistant-thread">
        {messages.map((item, index) => (
          <div key={index} className={`assistant-msg is-${item.role}`}>
            <p>{item.text}</p>
            {item.products?.length ? (
              <ul>
                {item.products.map((product) => (
                  <li key={product.id}>
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
        {busy ? <p className="assistant-busy">Looking through the catalog…</p> : null}
        <div ref={endRef} />
      </div>

      <form className="assistant-composer" onSubmit={send}>
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
    </div>
  )
}
