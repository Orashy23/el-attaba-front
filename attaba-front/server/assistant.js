import { log } from './logger.js'

function catalogReply(products, message) {
  const term = message.toLowerCase()
  const matches = products.filter(
    (item) =>
      item.title.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      (term.includes('deal') && item.badge === 'Deal') ||
      (term.includes('marvel') && item.category === 'marvel') ||
      (term.includes('anime') && item.category === 'anime') ||
      (term.includes('sport') && item.category === 'sports'),
  )
  const picks = (matches.length ? matches : products.filter((item) => item.badge === 'Deal')).slice(0, 3)
  const lines = picks.map((item) => `• ${item.title} — EGP ${item.price} (/product/${item.id})`).join('\n')
  return {
    provider: 'catalog_fallback',
    text: `I can help you pick a figure from the FIGURES. shelf.\n\n${lines}\n\nAsk for Marvel, anime, sports, gaming, or a budget.`,
    products: picks.map((item) => ({ id: item.id, title: item.title, price: item.price })),
  }
}

export async function askAssistant(store, message) {
  const text = String(message || '').trim().slice(0, 500)
  if (!text) {
    const err = new Error('Message is required')
    err.code = 'VALIDATION_ERROR'
    throw err
  }

  const key = process.env.GROQ_API_KEY
  const catalog = store.products
    .map((item) => `${item.id}|${item.category}|${item.title}|${item.price}`)
    .join('\n')

  if (!key) {
    log('info', 'assistant_fallback', { reason: 'no_groq_key' })
    return catalogReply(store.products, text)
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.4,
      max_tokens: 350,
      messages: [
        {
          role: 'system',
          content:
            'You are the FIGURES. shop assistant. Recommend only from this catalog. Keep answers short. Include product ids when you recommend.\n' +
            catalog,
        },
        { role: 'user', content: text },
      ],
    }),
  })

  if (!response.ok) {
    log('warn', 'assistant_groq_failed', { status: response.status })
    return catalogReply(store.products, text)
  }

  const body = await response.json()
  const reply = body.choices?.[0]?.message?.content || ''
  return {
    provider: 'groq_llama_3_1_8b',
    text: reply,
    products: [],
  }
}
