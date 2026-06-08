LUXE
Interswitch Payment Integration
Product Requirements Document & System Architecture
v1.0  —  June 2025

1. Document Overview
Field	Value
Project name	LUXE — Interswitch Checkout
Document type	PRD + System Architecture
Author	Engineering
Status	Draft — v1.0
Target completion	TBD
Stack	Next.js 14 (App Router), TypeScript, RTK Query, TailwindCSS, shadcn/ui, TanStack Table v8

2. Objectives
Build a production-quality, end-to-end checkout flow for the LUXE e-commerce application that integrates with the Interswitch Payment Gateway. The flow must handle all real-world payment states, verify transactions server-side before marking them as successful, and never expose secrets to the client.

Success criteria
•	A user can view a product summary, tap Pay Now, and complete payment via the Interswitch SDK.
•	Every transaction is verified server-side against the Interswitch verification endpoint before the UI shows a success state.
•	All three terminal states — success, failed, cancelled — render distinct, actionable UI feedback.
•	No API keys, merchant IDs, or secret tokens are accessible on the client.
•	The codebase is typed end-to-end with TypeScript and covered by unit tests.

3. Approved Tech Stack

Core framework
Concern	Technology	Rationale
Framework	Next.js 14 (App Router)	File-based routing, server components, API routes in one repo
Language	TypeScript 5.x	End-to-end type safety across client + server
Styling	TailwindCSS 3.x + shadcn/ui	Utility-first; consistent design tokens via CSS variables. shadcn/ui provides accessible, unstyled components built on Radix UI primitives.
State	Redux Toolkit + RTK Query	Matches existing LUXE store; RTK Query handles caching
Testing	Jest + React Testing Library	Unit tests for slices, hooks, and payment UI states
UI Components	shadcn/ui (Radix UI + TailwindCSS)	Accessible, composable components (Button, Card, Badge, Input, Select, etc.) built on Radix UI primitives; installed via npx shadcn-ui@latest add
Tables	TanStack Table v8 (@tanstack/react-table)	Headless table engine with sorting, filtering, and pagination; renders inside shadcn/ui Table primitives

Payment integration
Layer	Technology	Notes
Client SDK	Interswitch Inline JS (CDN)	Loaded via next/script Strategy=afterInteractive
Server init	Next.js Route Handler (POST)	Builds signed payload; never exposed to browser
Server verify	Next.js Route Handler (GET)	HMAC-signed request to Interswitch verify endpoint
Secrets	.env.local (never committed)	ISW_MERCHANT_CODE, ISW_PAY_ITEM_ID, ISW_SECRET_KEY

Data fetching
Concern	Approach
Product catalogue	RTK Query endpoint → DummyJSON /products/:id
Payment initiation	RTK Query mutation → POST /api/payment/init (own server)
Payment verification	RTK Query mutation → GET /api/payment/verify?txnRef=... (own server)
Cart state	Redux cartSlice (existing LUXE pattern)

4. Project Structure
New files and directories introduced by this feature:
Path	Purpose
app/checkout/page.tsx	Checkout page — product summary + Pay Now trigger
app/payment/status/page.tsx	Result page — renders success / failed / cancelled UI
app/api/payment/init/route.ts	Server Route Handler — builds signed Interswitch payload
app/api/payment/verify/route.ts	Server Route Handler — calls Interswitch verify endpoint
lib/interswitch/client.ts	Typed wrapper for Interswitch REST calls (server-only)
lib/interswitch/types.ts	Shared TypeScript types for gateway request/response
lib/interswitch/hash.ts	HMAC-SHA512 hash utility for request signing
store/slices/paymentSlice.ts	Redux slice — payment FSM state
store/api/paymentApi.ts	RTK Query endpoints for init and verify
components/checkout/CheckoutSummary.tsx	Product card shown on checkout page
components/checkout/PayButton.tsx	Pay Now CTA; mounts Interswitch inline widget
components/payment/ResultCard.tsx	Renders success / failed / cancelled states
components/ui/data-table.tsx	Reusable TanStack Table wrapper with sorting, filtering, and pagination; renders using shadcn/ui Table primitives
components/ui/ (shadcn)	shadcn/ui generated components (button, card, badge, input, select, table, etc.) — added via CLI, owned by the project
lib/table/columns.tsx	TanStack Table column definitions for transaction and order tables (ColumnDef typed)
hooks/useInterswitch.ts	Custom hook: loads SDK script, exposes pay()
.env.local (gitignored)	ISW_MERCHANT_CODE, ISW_PAY_ITEM_ID, ISW_SECRET_KEY, ISW_BASE_URL
__tests__/paymentSlice.test.ts	Unit tests for payment state machine
__tests__/ResultCard.test.tsx	RTL tests for all three result states

5. Functional Requirements
5.1  Checkout page (/checkout)
•	Fetch product data from DummyJSON via RTK Query on server component render.
•	Display: product name, image thumbnail, unit price, quantity (default 1), and computed total.
•	Show a disabled Pay Now button while product data is loading.
•	On Pay Now click: dispatch initiatePayment thunk, then invoke the Interswitch inline widget with the returned parameters.
•	Handle the initiation error state with an inline toast — do not navigate away.
5.2  Payment initiation (POST /api/payment/init)
•	Accept: product ID, amount (in kobo), customer email, customer name.
•	Compute HMAC-SHA512 hash of merchantCode + payItemId + amount using ISW_SECRET_KEY.
•	Return: txnRef, hash, merchantCode, payItemId, currency, redirectUrl, customerEmail to the client.
•	Never return ISW_SECRET_KEY or any raw secret in the response body.
•	Validate request body with Zod before processing.
5.3  Interswitch inline widget (client)
•	Load the Interswitch Inline JS bundle via next/script with strategy="afterInteractive".
•	On successful init response, invoke window.webpayCheckout() with the payload from the server.
•	The widget’s callback (onSuccess, onError, onCancel) updates paymentSlice state and navigates to /payment/status.
5.4  Payment callback + status page (/payment/status)
•	Interswitch redirects to this page with txnRef and resp query parameters.
•	On mount: dispatch verifyPayment thunk — this calls GET /api/payment/verify.
•	Show a full-screen loading skeleton while verification is in-flight.
•	Render one of three states based on verification response (see 5.5).
5.5  Server-side verification (GET /api/payment/verify)
•	Read txnRef from query string.
•	Call Interswitch GET /api/v2/purchases endpoint with HMAC-signed Authorization header.
•	Parse responseCode from the gateway response:
◦	responseCode === "00" → return { status: "success", ...txnDetails }
◦	responseCode === "T0" or user-cancelled signal → return { status: "cancelled" }
◦	Any other code → return { status: "failed", code, message }
•	Cache result in RTK Query for 30 seconds to survive React StrictMode double-invocations.
5.6  Result page UI
State	UI Elements	CTA
Success	Green check icon, "Payment successful", amount + txnRef	Continue Shopping → /
Failed	Red X icon, "Payment failed", gateway error message	Try Again → /checkout
Cancelled	Grey X icon, "Payment cancelled"	Return to Checkout → /checkout

6. Non-Functional Requirements
Category	Requirement
Security	ISW_SECRET_KEY must only exist in process.env on the server. client bundles are audited via Next.js bundle analyser.
Security	All server route handlers validate request origin and content-type before processing.
Security	HMAC hash is recomputed on the server for every initiation and verification call.
Performance	Checkout page LCP < 2.5 s on 4G. RTK Query caches product fetch for 5 min.
Reliability	Interswitch SDK script load failure shows an inline fallback message ("Payment temporarily unavailable").
Accessibility	Result page passes WCAG 2.1 AA. Focus managed to the result heading on navigation. shadcn/ui components are built on Radix UI and ship with ARIA roles and keyboard navigation out of the box.
Testing	paymentSlice state transitions have 100% branch coverage. ResultCard has RTL tests for all three states.
Environment	Three environments: development (sandbox), staging (sandbox), production (live). Controlled via NEXT_PUBLIC_ISW_ENV.

7. Redux Slice Design — paymentSlice
The payment slice models a finite state machine. The UI derives its appearance entirely from this slice; it never stores payment state in component state or URL params alone.

State field	Type	Description
status	"idle" | "initiating" | "processing" | "verifying" | "success" | "failed" | "cancelled"	Current FSM node
txnRef	string | null	Interswitch transaction reference
amount	number | null	Amount in kobo
error	string | null	Human-readable error message for failed state
responseCode	string | null	Raw gateway response code for debugging
verifiedAt	number | null	Unix timestamp of successful verification

State transitions
Action / event	From state(s)	To state
initiatePayment.pending	idle	initiating
initiatePayment.fulfilled	initiating	processing
initiatePayment.rejected	initiating	failed
SDK onSuccess callback	processing	verifying
SDK onCancel callback	processing	cancelled
verifyPayment.pending	verifying (already set)	verifying
verifyPayment.fulfilled + code 00	verifying	success
verifyPayment.fulfilled + other code	verifying	failed
verifyPayment.rejected	verifying	failed
resetPayment()	any	idle

8. Internal API Contract
POST /api/payment/init
Request body
Field	Type	Required	Notes
productId	string	Yes	Used to look up price if not passed directly
amount	number	Yes	In kobo (multiply NGN by 100)
customerEmail	string	Yes	Passed to Interswitch widget
customerName	string	Yes	Passed to Interswitch widget

Response (200)
Field	Type	Notes
txnRef	string	Unique reference for this transaction
hash	string	HMAC-SHA512 of merchantCode + payItemId + amount
merchantCode	string	From env — safe to expose (not a secret)
payItemId	string	From env — safe to expose
currency	566	NGN ISO numeric code
redirectUrl	string	Absolute URL to /payment/status
customerEmail	string	Echo of input
customerName	string	Echo of input

GET /api/payment/verify?txnRef={ref}
Response (200)
Field	Type	Notes
status	"success" | "failed" | "cancelled"	Derived from gateway responseCode
txnRef	string	Echo of input
amount	number | null	In kobo; present on success
responseCode	string	Raw Interswitch code for debugging
message	string	Human-readable status message

9. Environment Variables
Variable	Exposure	Description
ISW_MERCHANT_CODE	Server only	Interswitch merchant code
ISW_PAY_ITEM_ID	Server only	Payment item ID from Interswitch dashboard
ISW_SECRET_KEY	Server only	Secret key for HMAC signing — never expose
ISW_BASE_URL	Server only	https://sandbox.interswitchng.com (sandbox) or production URL
NEXT_PUBLIC_ISW_ENV	Client + Server	"sandbox" | "production" — controls which JS bundle URL is loaded
NEXT_PUBLIC_APP_URL	Client + Server	Absolute base URL for redirect callback (e.g. https://luxe.vercel.app)

Rule: any variable that must appear in browser-sent requests is prefixed NEXT_PUBLIC_. Variables without the prefix are stripped from the client bundle by Next.js at build time. ISW_SECRET_KEY must never carry the NEXT_PUBLIC_ prefix.

10. Testing Plan
Test suite	Coverage target	Key scenarios
paymentSlice.test.ts	100% branches	All FSM transitions; reset; concurrent dispatch guard
paymentApi.test.ts	Happy + error paths	init returns correct payload; verify maps all response codes
ResultCard.test.tsx	3 states	Success renders txnRef; Failed shows CTA; Cancelled shows CTA
useInterswitch.test.ts	Script load	Resolves when window.webpayCheckout available; rejects on timeout
E2E (manual)	Sandbox flow	Full payment with Interswitch test cards through to verified success

Test cards for Interswitch sandbox are available in the Interswitch developer portal. Use the test card number 5061 4607 0000 0000 001 with any future expiry for a simulated success.

11. Edge Cases & Risk Mitigation
Scenario	Handling
Interswitch JS fails to load	useInterswitch hook catches script error; PayButton shows inline fallback UI.
User navigates away mid-payment	paymentSlice remains in 'processing'; on return to /checkout, resetPayment() is called.
Duplicate txnRef on retry	Each init call generates a new txnRef via crypto.randomUUID().
Verify called before redirect completes	RTK Query deduplicates in-flight verify calls; result is cached.
Network timeout on verify	RTK Query retries up to 2 times with exponential backoff; on final failure, status = failed.
User refreshes on /payment/status	txnRef is read from URL query param; verify is re-triggered; cached result returns instantly.
Amount mismatch (gateway vs local)	Verified amount from gateway is displayed on success; local amount is not used for confirmation.

12. Deliverables Checklist
•	Working checkout page with product summary and Pay Now button.
•	Interswitch Inline JS integrated and triggered on Pay Now.
•	POST /api/payment/init Route Handler with HMAC signing.
•	GET /api/payment/verify Route Handler calling Interswitch verify endpoint.
•	paymentSlice implementing the documented FSM.
•	RTK Query endpoints for init and verify.
•	/payment/status page rendering all three terminal states.
•	All sensitive config in .env.local; NEXT_PUBLIC_ convention enforced.
•	Unit tests for slice, API, and result UI.
•	README section documenting environment variable setup.

