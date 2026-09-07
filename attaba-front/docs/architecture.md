# FIGURES. architecture (basic)

```
[Browser React SPA]
   hooks + CartContext + AuthContext
   fetch /api/v1  (JWT, Idempotency-Key)
        |
[Vite / Express modular monolith]
   /products (in-memory cache)
   /auth/login (JWT)
   /orders (state machine + snapshots)
   /assistant (Groq or catalog fallback)
        |
[In-process store]  →  later: Postgres + Redis + LB
```

At multiple instances: stateless API, JWT, Redis cache. No sticky sessions.

## ERD (target schema; demo uses in-memory maps)

```mermaid
erDiagram
  USER ||--o{ ORDER : places
  ORDER ||--|{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : snapshotted_into

  USER {
    string id PK
    string email UK
    string password_hash
    string role
  }
  PRODUCT {
    string id PK
    string title
    int price
    string category
  }
  ORDER {
    string id PK
    string customer_id FK
    string status
    int total
    string payment_id
    string payment_status
  }
  ORDER_ITEM {
    string order_id FK
    string product_id
    int qty
    int unit_price_snapshot
  }
```

`unit_price_snapshot` is the historical price. It is not a live FK to `PRODUCT.price`.
