# FIGURES. — design decisions (internship write-up)

This is a **small modular monolith**: React (Vite) storefront + an Express `/api/v1` module in the same repo. We are not shipping microservices, sharding, or a real payment gateway. Those are discussed here so we can defend them; the code only reflects the decisions that belong at this scale.

## Stack

- **Frontend: React 19 + Vite.** We already had a polished SPA. Hooks + a thin `services/` layer match a catalog/cart/checkout UI. We rejected Next.js — no SEO/SSR requirement for a one-week demo, and extra routing complexity.
- **Backend: Express on Node.** Same language as the UI, one `npm run dev`, enough for JWT, DTOs, cache headers, and idempotent checkout. We rejected a .NET API for this repo because the storefront was already React; if the team had started on ASP.NET we would still map DTOs **manually** (below), not AutoMapper.
- **Data: in-memory catalog + order map.** A real deploy would use **PostgreSQL**. We rejected Mongo as the system of record — orders, prices, and ownership are relational. Redis would sit in front later, not replace the DB.

## Architecture

**Modular monolith, not microservices.** One team, one checkout flow, one database. Microservices would force network joins, distributed auth, and ops we cannot staff. Inside the monolith we split modules (`auth`, `checkout`, `assistant`, `dtos`) so a later extract of “orders” would be possible.

**Scale story (to ~1M users, not implemented):**
1. Vertical first: bigger Node/Postgres box. The app is read-heavy; CPU and DB I/O on `GET /products` break first.
2. Horizontal next: several stateless API instances behind a **load balancer**. That forces JWT (or Redis sessions) and a **distributed cache** — an in-memory product cache per process would drift. Sticky sessions would hide the problem and we rejected them.
3. Cache: in-process TTL on the product list now (fits current read pattern). At scale: Redis for catalog + CDN for images. Client cache is already hinted with `Cache-Control`.
4. Partitioning: a **single Postgres** is enough far past this demo (hundreds of GB with indexes). When it is not, shard **orders by `customer_id` hash** so “my orders” stays local. Catalog is replicated, not sharded. Cost: no cheap cross-customer joins; reporting goes to a replica/warehouse.
5. Checkout stays in the monolith longest. Search/assistant can split out first.

## Data model

Normalized: `users`, `products`, `orders`, `order_items`. Prices live on `order_items.unit_price_snapshot` — **copied at checkout from the product row**, never trusted from the client, never joined back to live `products.price`. If Iron Man goes on sale tomorrow, last week’s order still totals correctly for refunds and invoices.

## Auth, payments, API

- **JWT (HS256) in Authorization header.** Sessions would need sticky load balancers or Redis. OAuth2 is for “sign in with Google”, not our first customer path. Token storage: **memory + localStorage** in this demo (simple, visible). Production: **httpOnly Secure cookie** so XSS cannot steal it.
- Roles: `customer` vs `admin`. `GET /orders/:id` checks **ownership** unless admin.
- **Payment: mock Instapay.** Egypt-first, cash-adjacent, no PCI scope. Stripe later for cards; Vodafone Cash as a second wallet; PayPal is weaker locally. No real gateway (out of scope).
- **Idempotency-Key** on `POST /orders`. Retries/timeouts reuse the key; in-flight requests share one promise so concurrent double-clicks create **one** order. Tests in `server/idempotency.test.js`.
- **Order states:** `pending_payment → paid → placed`. If payment succeeds and insert fails: `compensation_required` + `refund_pending` (saga compensation). Checkout has a checkbox to demo this.
- API: `/api/v1`, `{ data, meta }` / `{ error: { code, message, details } }`, pagination + filter on products, rate limits on login and assistant.
- **DTOs only.** Entities (passwords, internal payment ids) stay in the store. Mapping is **manual**. AutoMapper/Mapster use reflection, hide breakage when fields rename, and cost more than a 10-field catalog. We maintain `server/dtos.js` and `src/services/mapDto.js` side by side.

## Caching, logging, AI, frontend

- Cached endpoint: `GET /api/v1/products` (60s memory + `X-Cache` header).
- Logs: JSON via a tiny logger, not Serilog (we are not on .NET). Levels: `info` HTTP, `warn` auth, `error` compensation. Keys matching password/token/secret/payment are **redacted**.
- **AI: Groq Llama 3.1 8B** if `GROQ_API_KEY` is set — fast, cheap, server-side so the key never hits the browser. Otherwise a **catalog-grounded fallback** so the widget always works. Used as a **figure finder** (bottom-right AI button), not a fake recommendation engine.
- Frontend: pages = routes, `context` = cart/auth, `services` = HTTP, components split layout / products / ai. Cart copies `unitPriceSnapshot` when adding.

## Hardening (baseline)

Validation on login and checkout, 32kb JSON limit, rate limits, secrets from env, no entity leak, ownership checks. Not production-hardened.

## Who owned what

| Area | Owner |
| --- | --- |
| Storefront UI (header, home, PDP, cart look) | Frontend |
| React structure, cart snapshots, checkout UX | Frontend |
| `/api/v1`, DTOs, JWT, cache, logging | Backend module in `/server` |
| Idempotency, order state machine, tests | Backend |
| Figure finder widget + Groq/fallback | Shared (API + FAB) |
| Scale / sharding / LB reasoning | Shared (this doc) |

Demo logins: `customer@figures.test` / `password123` and `admin@figures.test` / `password123`.
