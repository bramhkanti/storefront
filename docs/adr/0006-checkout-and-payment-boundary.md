# ADR 0006: Checkout Architecture and Payment Provider Integration Boundary

## Status

Accepted

## Context

The Bramhkanti storefront requires robust shopping cart and checkout capabilities for Indian consumers. E-commerce in India has specific operational patterns:

1. Significant volume of Cash on Delivery (COD) requiring phone/SMS address confirmation.
2. Multiple payment rails: UPI QR/Intent, NetBanking, Debit/Credit Cards, and Wallets managed by gateways like Razorpay, PhonePe, and Cashfree.
3. Strict statutory requirements for GST tax breakdowns and FSSAI disclosures.

Per project scope, full backend payment gateway integrations and payment gateway SDKs are deferred to when the Medusa.js v2 backend is live with payment modules. However, the frontend architecture must define clean, strictly typed extension points now, adhering to SOLID principles (Open/Closed Principle, Interface Segregation).

## Decisions

### 1. Separation of Cart and Order Lifecycles

- **Cart (`CartService`, `Cart`, `CartItem`)**:
  - Ephemeral shopper session identified by an HTTP-only cookie (`bramhkanti_cart_id`).
  - Read-your-own-writes consistency ensured via Next.js 16 Server Actions and `updateTag('cart:<id>')`.
  - Optimistic client-side updates via React 19 `useOptimistic`.
- **Order (`Order`, `OrderItem`, `CheckoutService`)**:
  - An immutable post-checkout entity created from a cart upon confirmation.
  - Order numbers follow statutory sequence formatting.

### 2. Open/Closed Payment Provider Interface (`PaymentProvider`)

Payment gateways are modelled as pluggable providers:

- `PaymentProvider`: Contract defining `initiatePayment(order)` and `verifyWebhook(payload, signature)`.
- `PaymentProviderRegistry`: In-memory registry enabling multiple gateways (e.g. Razorpay, PhonePe, COD) to be registered without modifying the core checkout flow.
- Gateway-specific SDKs are never imported into core UI components; only provider adapters interact with gateway APIs.

### 3. SEO and Crawler Protection

- `/cart` and `/checkout` routes declare explicit `robots: { index: false, follow: false }` metadata.
- `RESERVED_SLUGS` in `src/lib/config/reserved-slugs.ts` reserves `cart` and `checkout` to prevent dynamic category routing collisions.

### 4. Pan-India Delivery Milestone

- Free express delivery threshold is anchored to ₹499 (49,900 paise).
- Subtotals below ₹499 incur flat ₹70 shipping; subtotals at or above ₹499 trigger zero shipping and celebratory UI indicator.

## Consequences

- **Positive**: Clean separation of responsibilities; zero third-party payment SDK overhead in current bundle; straightforward path to plug in Razorpay/PhonePe once backend payment modules are configured.
- **Negative**: Live transactional processing remains in demo/mock mode until payment credentials and backend webhooks are activated.
