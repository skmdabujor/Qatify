# 📚 Qatify Backend Documentation (Convex + Polar)

Welcome to the backend architecture and documentation hub for **Qatify** — modern Qatar-focused dropshipping electronics and lifestyle e-commerce platform.

This directory contains complete, in-depth documentation and implementation guides for:
1. **[Convex Database & Real-Time Backend](convex/01-overview-and-setup.md)** (`https://docs.convex.dev/home`)
2. **[Polar 2026-10 Payments & Checkouts API](polar/01-introduction-and-sdk-setup.md)** (`https://polar.sh/docs/api-reference/2026-10/introduction`)
3. **[End-to-End Qatify Architecture Blueprint](polar/05-qatify-backend-architecture.md)**

---

## 🧭 Documentation Index

### ⚡ Convex Backend Guides (`/docs/convex`)
* **[01. Overview & Setup](convex/01-overview-and-setup.md)**: Convex fundamentals, Next.js 15 App Router setup, `ConvexClientProvider`, environment configuration, and CLI commands.
* **[02. Schema & Data Modeling](convex/02-schema-and-data-modeling.md)**: `defineSchema`, `defineTable`, `v` validators, indexing, and complete Qatify database schema (Products, Categories, Orders, Customers, Tracking).
* **[03. Queries & Mutations](convex/03-queries-and-mutations.md)**: Real-time queries, transactional mutations, pagination, reactive UI hooks (`useQuery`, `useMutation`), and optimistic updates.
* **[04. Actions & External APIs](convex/04-actions-and-external-apis.md)**: Convex Actions, calling external APIs (Polar SDK, Email, SMS, Logistics), running queries and mutations from actions.
* **[05. HTTP Router & Webhook Ingestion](convex/05-http-router-and-webhooks.md)**: `convex/http.ts`, `httpRouter`, `httpAction`, incoming webhook verification, and safe internal mutation dispatching.
* **[06. Authentication & Security](convex/06-authentication-and-security.md)**: Auth patterns, user identification, access control, and helper security validators.

### 💳 Polar 2026-10 Payment & Checkout Guides (`/docs/polar`)
* **[01. Introduction & SDK Setup](polar/01-introduction-and-sdk-setup.md)**: Polar 2026-10 API introduction, authentication tokens, installing `@polar-sh/sdk`, client initialization (Sandbox & Production).
* **[02. Checkouts & Payment Flows](polar/02-checkouts-and-payment-flows.md)**: Programmatic checkout creation (`polar.checkouts.create`), custom fields, Qatar Riyal (QAR) pricing, dynamic products, and redirect handling.
* **[03. Orders & Customers API](polar/03-orders-and-customers.md)**: Order retrieval, order statuses, customer metadata, invoice access, and dropshipping fulfillment hooks.
* **[04. Webhooks & Verification](polar/04-webhooks-and-verification.md)**: Standard Webhooks HMAC verification, handling `checkout.created`, `order.created`, and `order.paid` events.
* **[05. Qatify Backend Architecture](polar/05-qatify-backend-architecture.md)**: Complete step-by-step end-to-end flow: Frontend Cart ➔ Convex Order ➔ Polar Checkout ➔ Webhook ➔ 6–10 Day Qatar Air Express Tracking.

---

## 🛠️ Quick Backend Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router, React 19) | E-commerce Storefront, Cart, Checkout, Dashboard |
| **Backend & Database** | Convex (`convex`) | Serverless functions, real-time database, queries, mutations, actions |
| **Payment Gateway** | Polar 2026-10 (`@polar-sh/sdk`) | Digital checkouts, QAR payments, order invoices, webhook delivery |
| **Webhooks** | Convex HTTP Router (`convex/http.ts`) | Receives Polar webhooks securely via Standard Webhook signatures |
| **Tracking Engine** | Convex Realtime Reactive Tables | Live 6–10 days tracked shipment status for Qatar customers |

---

## 🚀 Quick Start Commands

```bash
# 1. Install Convex and Polar SDK
npm install convex @polar-sh/sdk standardwebhooks

# 2. Initialize Convex in development mode
npx convex dev

# 3. Test Polar CLI for Webhook listening (optional for local dev)
polar webhook listen http://localhost:3000/api/webhooks/polar
```

