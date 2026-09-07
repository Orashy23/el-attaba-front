const SECRET_KEYS = /password|token|authorization|secret|api[-_]?key|card|cvv|pan|payment/i

function redact(value) {
  if (value == null) return value
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(redact)
  if (typeof value === 'object') {
    const out = {}
    for (const [key, nested] of Object.entries(value)) {
      out[key] = SECRET_KEYS.test(key) ? '[redacted]' : redact(nested)
    }
    return out
  }
  return value
}

export function log(level, message, meta = {}) {
  const line = {
    ts: new Date().toISOString(),
    level,
    message,
    ...redact(meta),
  }
  const text = JSON.stringify(line)
  if (level === 'error') console.error(text)
  else if (level === 'warn') console.warn(text)
  else console.log(text)
}
