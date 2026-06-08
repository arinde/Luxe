# LUXE — E-Commerce Checkout

An e-commerce checkout flow built with **Next.js 14** (App Router), **TypeScript**, **Redux Toolkit**, **TailwindCSS**, and **shadcn/ui**. Integrates with **Interswitch Payment Gateway** (Web Checkout inline) for Nigerian Naira payments.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State**: Redux Toolkit + RTK Query
- **Styling**: TailwindCSS + shadcn/ui
- **Payment**: Interswitch Web Checkout (inline)
- **Product API**: DummyJSON

## Features

- Product catalogue from DummyJSON API
- Cart with localStorage persistence (24h expiry)
- Checkout form with auto-save
- Payment via Interswitch inline modal (no card data touches your server)
- Server-side transaction verification via OAuth 2.0 + Interswitch requery
- Payment status page with success/failed/cancelled states
- All monetary values in kobo internally; converted from USD at ₦1,380/USD

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` or create `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | App URL (e.g. `http://localhost:3000`) |
| `ISW_MERCHANT_CODE` | Interswitch merchant code |
| `ISW_PAY_ITEM_ID` | Interswitch pay item ID |
| `ISW_CLIENT_ID` | Interswitch client ID for OAuth |
| `ISW_SECRET_KEY` | Interswitch secret key for OAuth |
| `ISW_PASSPORT_URL` | OAuth token endpoint base URL |
| `ISW_REQUERY_BASE_URL` | Transaction requery base URL |
| `NEXT_PUBLIC_ISW_MODE` | `TEST` or `LIVE` |
| `NEXT_PUBLIC_ISW_SCRIPT_URL` | Interswitch inline checkout script URL |

### Sandbox Credentials

Obtain from [Interswitch Developer Dashboard](https://developer.interswitchgroup.com).

## Test Cards

| Card | PAN | Expiry | CVV | PIN | Result |
|---|---|---|---|---|---|
| VISA | `4000000000002503` | `03/50` | `11` | `1111` | Success |
| Verve | `5061050254756707864` | `06/26` | `111` | `1111` | Success |
| Mastercard | `5123450000000008` | `01/39` | `100` | `1111` | Success |

## Payment Flow

1. User adds products to cart and proceeds to checkout
2. Fills contact and delivery details (auto-saved)
3. Clicks Pay → server generates transaction ref (`LUXE_<email>_<timestamp>`)
4. Interswitch inline modal opens; user enters card
5. On success, redirect to status page → server verifies via Interswitch requery API
6. Cart cleared on successful verification

## Monetary Convention

- **Store**: All prices in **kobo** (₦1 = 100 kobo)
- **DummyJSON**: USD prices converted at ₦1,380/USD
- **Display**: `formatCurrency(kobo)` divides by 100 for NGN display
- **Interswitch**: Amount passed in kobo (minor unit) per Interswitch spec
