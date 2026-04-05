# Fictional Pizza Shop

React + Vite pizza shop app with a Square hosted checkout flow and Neon order persistence.

## Square Checkout Setup

### 1) Required environment variables

Copy `.env.example` to `.env` and fill values:

- `SQUARE_ACCESS_TOKEN`
- `SQUARE_LOCATION_ID`
- `SQUARE_ENVIRONMENT` (`sandbox` or `production`)
- `ALLOW_LIVE_PAYMENTS` (`false` by default; set `true` only when intentionally enabling real charges)
- `DATABASE_URL` (Neon connection string)
- `CHECKOUT_SUCCESS_URL` (example: `http://localhost:5173/checkout/success`)
- `CHECKOUT_CANCEL_URL` (example: `http://localhost:5173/checkout/cancel`)
- `VITE_PUBLIC_SITE_URL` (example: `http://localhost:5173`)
- Optional: `SQUARE_WEBHOOK_SIGNATURE_KEY`
- Optional: `CHECKOUT_TAX_RATE` (decimal, e.g. `0.07`)

### 2) Get Square sandbox credentials

1. Create/login to Square Developer Dashboard.
2. Open your Sandbox test account.
3. Copy Sandbox access token and location ID.
4. Set `SQUARE_ENVIRONMENT=sandbox`.

### 3) Connect Neon

1. Create a Neon project/database.
2. Add your Neon connection URL to `DATABASE_URL`.
3. Run the SQL in `sql/orders.sql` against Neon (or let API auto-create table on first checkout request).

### 4) Install and run locally

```bash
npm install
npm run dev
```

Frontend app runs on Vite. Vercel-style API routes are expected under `/api`.

### 5) Test checkout in sandbox

1. Add items to cart.
2. Click `Checkout` in the cart drawer.
3. App calls `/api/create-checkout` and receives a hosted checkout URL.
4. Browser redirects to Square hosted checkout.
5. After payment completion, Square redirects to `/checkout/success`.

If checkout creation fails, a user-friendly error appears in the cart drawer.

### 6) Deploy to Vercel

1. Push this repo to Git.
2. Import project in Vercel.
3. Add all env vars from above in Vercel Project Settings.
4. Deploy.

### 7) Configure webhook URL (production)

Point Square webhook endpoint to:

`https://<your-domain>/api/square/webhook`

Current webhook route is scaffolded and includes TODO markers for strict signature verification.

### 8) Switch from sandbox to production

1. Replace `SQUARE_ACCESS_TOKEN` with production token.
2. Replace `SQUARE_LOCATION_ID` with production location.
3. Set `SQUARE_ENVIRONMENT=production`.
4. Set `ALLOW_LIVE_PAYMENTS=true` to intentionally allow live charges.
5. Ensure production `CHECKOUT_SUCCESS_URL` and `CHECKOUT_CANCEL_URL` match your domain.

### Demo safety lock

Checkout API blocks real production payments unless `ALLOW_LIVE_PAYMENTS=true`.
This protects demo/recruiter traffic from accidental purchases.

## Checkout flow (end-to-end)

1. User clicks `Checkout` in cart drawer.
2. Frontend normalizes cart + calculates totals using shared helpers.
3. Frontend posts order payload to `/api/create-checkout`.
4. API validates payload, normalizes cart, recomputes totals server-side.
5. API creates a `pending_payment` order row in Neon.
6. API calls Square Create Payment Link (hosted checkout).
7. API stores `square_payment_link_id` and `square_order_id` on the order.
8. API returns checkout URL to frontend.
9. Frontend redirects browser to Square hosted checkout.

## Key paths

- Frontend cart checkout wiring: `src/App.jsx`
- Shared cart normalization: `shared/cartSchema.js`
- Shared totals helper: `shared/calculateTotals.js`
- Checkout API route: `api/create-checkout.js`
- Webhook scaffold: `api/square/webhook.js`
- Neon DB helper: `lib/db.js`
- Orders data access: `lib/orders.js`
- Success page: `src/pages/CheckoutSuccess.jsx`
- Cancel page: `src/pages/CheckoutCancel.jsx`
