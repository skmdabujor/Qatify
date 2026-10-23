
# Qatify — Master Frontend UI/UX & Next.js + SCSS Prompt (Phase 1)

Use the master prompt below (or the modular step-by-step prompts that follow) with any AI coding assistant (such as Cursor, Windsurf, Claude, or ChatGPT) to design and build **Qatify**, a modern Qatar-focused dropshipping electronics and lifestyle e-commerce frontend inspired by the high-density retail workflows of [Al Anees Qatar](https://alaneesqatar.qa/) (`alaneesqatar.qa`) while establishing a completely original, vibrant, and premium visual identity.

## 1. Complete Copy-Paste Master Prompt

```markdown
Act as a Principal UI/UX Designer and Senior Frontend Architect. Your task is to design and build **Phase 1 (Complete Frontend UI/UX only — no backend database or live payment gateway integration yet)** for **Qatify**, a high-conversion multi-category electronics, mobile accessories, and trending gadgets dropshipping e-commerce platform tailored for Qatar.

### 1. Brand Benchmark, Regional Density & Dropshipping Model
- **Functional Inspiration**: Take functional inspiration from leading Qatari retail platforms such as Al Anees Qatar (https://alaneesqatar.qa/) — specifically high-velocity category discovery, flash deal countdowns, QAR (Qatari Riyal) pricing clarity, trust badges, and effortless checkout flows.
- **Regional Design Density ("হালকা ঘন" / Medium-High Information Density)**:
  - Shoppers in Qatar prefer lively, deal-rich, and information-dense e-commerce storefronts over sparse, empty-space minimalism.
  - Design a **moderately dense, content-rich layout** (tight `12px–16px` grid gaps, 4-to-5-column desktop product grids, multi-banner hero showcases, quick-filter category pills, stock progress bars, and visible discount/shipping badges on every card) while keeping the alignment, typography, and hierarchy crisp, structured, and easy to scan.
- **Dropshipping Logistics (6–10 Days Tracked Delivery to Qatar)**:
  - Operate on a cross-border dropshipping fulfillment model with **6–10 Business Days Tracked Delivery across Qatar** (Doha, Lusail, Al Rayyan, Al Wakrah, Al Khor, etc.).
  - Never claim "Same-Day" or "2-Hour" delivery. Instead, highlight **"✈️ Direct Global Air Express | 6–10 Days Doorstep Delivery in Qatar"**, **"100% Quality Inspected Before Dispatch"**, and **"Live Step-by-Step Shipment Tracking from Global Hub to Qatar"**.
- **Strict Anti-Copy Rule**: Do NOT copy the exact DOM structure, branding, or legacy clutter of `alaneesqatar.qa`.

### 2. Visual Identity & Strict 60/30/10 Color System (Red, Yellow, Black, White)
Maintain a vibrant, premium, and clean aesthetic governed strictly by the **60/30/10 color rule**:

- **60% Dominant Base (Clean White & Deep Carbon Black)**:
  - Primary Page Canvas: Crisp Alabaster White (`#FFFFFF` / `#F8F9FA`) for maximum product photography clarity and dense catalog readability.
  - Structural Anchors: Deep Obsidian Black (`#0A0A0C`) for the global announcement bar, secondary category strip, primary typography, high-contrast promo banners, and global footer.
- **30% Secondary Containers & Supporting Surfaces (Monochrome Neutrals & Soft Tints)**:
  - Card Surfaces & Filter Panels: Soft Warm Gray (`#F1F3F5`), Elevated Surface White (`#FFFFFF` with subtle border `#E4E4E7`), and Charcoal Surface (`#16161A`) for dark-mode promotional bento cards, specification tables, and dashboard sidebars.
  - Secondary Text & Dividers: Slate Muted (`#52525B`) and Hairline Border (`#E4E4E7`).
- **10% High-Energy Accent (Vibrant Qatify Red & Electric Solar Yellow)**:
  - Primary Action Red (`#E11D48` / `#DC2626`): Primary "Add to Cart" and "Buy Now" CTAs, active navigation indicators, discount badges (`-35% OFF`), and urgent flash-sale countdown triggers.
  - Electric Highlight Yellow (`#FACC15` / `#EAB308`): "✈️ 6–10 Days Delivery to Qatar" badges, star ratings, promo spotlight pills, interactive focus rings, and key logo geometry accents.

### 3. Qatify Logo Concept & Brand Mark
Create a scalable, reusable inline SVG `<QatifyLogo />` component (`components/brand/QatifyLogo.tsx`) with both light and dark variants:
- **Iconography**: A geometric, forward-leaning **"Q"** monogram where the tail of the "Q" forms a dynamic lightning bolt / fast-forward spark in **Electric Yellow (`#FACC15`)** nested inside a bold **Qatify Red (`#E11D48`)** rounded squircle badge.
- **Wordmark**: Bold geometric sans-serif typography (`Plus Jakarta Sans` or `Inter`, 800 weight, tight `-0.03em` tracking) reading **QATIFY**, with a subtle yellow dot on the "i" and a `.qa` pill badge.

### 4. Tech Stack & Architecture Constraints (Phase 1)
- **Framework**: Next.js (App Router) with TypeScript (`strict: true`).
- **Styling**: Modular SCSS (`sass`) using CSS custom properties + SCSS variables, mixins, responsive breakpoint helpers, and BEM-clean module classes (`*.module.scss`). Do NOT use Tailwind CSS.
- **State Management (Frontend Mock State)**: React Context + `localStorage` persistence for Cart Drawer, Wishlist, Product Comparison, Filter/Sort state, and Dashboard view switching, backed by rich, realistic Qatari dropshipping e-commerce mock data (`data/products.ts` with prices in `QAR` and estimated 6–10 day delivery windows).
- **Icons & Fonts**: `lucide-react` for crisp iconography; `Plus Jakarta Sans` (headings), `Inter` (body), and `JetBrains Mono` (SKUs, QAR prices, countdown timers, tracking numbers).

### 5. App Router Directory Structure
Implement the exact Next.js App Router hierarchy below:

app/
├── (shop)/
│   ├── page.tsx                  # Homepage (Dense Multi-Banner Hero, Flash Deals, Category Grid, Trending Dropship)
│   ├── shop/
│   │   └── page.tsx              # Product Catalog / Listing (Faceted Sidebar Filters, Sort, 4-Col Dense Grid)
│   └── products/
│       └── [slug]/
│           └── page.tsx          # Dynamic Product Detail Page (Gallery, Variants, 6-10 Day Delivery Timeline, Specs)
├── cart/
│   └── page.tsx                  # Full Cart Page & Slide-Over Cart Drawer synchronization
├── checkout/
│   └── page.tsx                  # Multi-step Checkout UI (Qatar Zone/Street/Building Address, 6-10 Day Shipping)
├── dashboard/
│   └── page.tsx                  # User & Store Dashboard (International Shipment Tracker, Orders, Analytics)
└── layout.tsx                    # Global Layout (Top Promo Bar, Sticky Mega-Navbar, Category Strip, Cart Drawer, Footer)

### 6. SCSS Architecture (`styles/`)
Organize global and modular SCSS cleanly:
- `styles/_variables.scss`: 60/30/10 color tokens, compact spacing scale (`4px` base grid for medium-high density), border radii (`6px`, `10px`, `16px`), shadows, z-index layers, and typography tokens.
- `styles/_mixins.scss`: Responsive media queries (`mobile: 480px`, `tablet: 768px`, `laptop: 1024px`, `desktop: 1280px`, `wide: 1440px`), flex/grid helpers, compact card mixins, and button/badge states.
- `styles/globals.scss`: CSS reset, smooth scrolling, custom scrollbar, and base utility classes.

### 7. Page-by-Page UI/UX Specifications

#### A. Global Layout (`app/layout.tsx`)
1. **Top Utility Bar (Black `#0A0A0C` background, White text, Yellow `#FACC15` highlights)**:
   - "✈️ Direct Global Air Shipping: 6–10 Days Delivery Across Qatar | Free Shipping Over QAR 150" | Track Order | Help Center | Language/Currency indicator (`EN / العربية | QAR`).
2. **Sticky Two-Tier Header & Mega-Menu (Medium-High Density)**:
   - **Main Bar**: `<QatifyLogo />`, wide predictive search bar with category filter dropdown and trending search tags (e.g., "MagSafe", "ANC Earbuds", "Gaming Mouse", "Smartwatch"), Flash Deals button (Red accent), Wishlist badge, Cart Drawer trigger with live item count & QAR subtotal, and Account/Dashboard link.
   - **Secondary Category Strip**: Quick-jump links for All Categories, Super Deals Under QAR 99, New Arrivals, Top Rated in Qatar, Mobile Accessories, Smart Home, and Bundle Savers.
3. **Slide-Over Cart Drawer (`components/cart/CartDrawer.tsx`)**:
   - Accessible from any page; includes a "Free Qatar Delivery Progress Bar (QAR 150 threshold)", estimated 6–10 day arrival date preview, quantity steppers, promo code input, and instant buttons for `/cart` and `/checkout`.

#### B. Homepage (`app/(shop)/page.tsx`) — Structured Medium-High Density ("হালকা ঘন")
1. **3-Column High-Density Hero Showcase**:
   - Left (2 cols on 12-col grid): Quick vertical category menu with icons & hover flyouts.
   - Center (7 cols): High-contrast dark obsidian showcase banner featuring viral tech & flagship gadgets with Red primary CTA ("Shop Super Deals") and Yellow "Direct Air Express • 6–10 Days to Qatar" badge.
   - Right (3 cols): Two stacked promo cards ("Gadgets Under QAR 49" & "Bundle & Save Extra 20%").
2. **Compact 2-Row Category Ribbon**:
   - 10–12 dense icon+label pills for Mobiles, Smartwatches, TWS Audio, Powerbanks, Car Tech, Gaming, Drones & Cameras, Smart Home, Laptop Gear, and Cables/Chargers.
3. **"Fantastic Flash Deals" Countdown Section**:
   - Live countdown timer in `JetBrains Mono` (Yellow on Black pill) + 5-column dense product grid with stock-level progress bars ("78% Claimed — Limited Air Batch").
4. **Curated Category Strips & Trust Assurance Bar**:
   - Dense horizontal product shelves ("Trending in Doha This Week", "Best-Selling Smart Accessories") + 4-card Qatify Dropship Assurance strip (✈️ 6–10 Days Tracked Air Delivery, 🛡️ 100% Quality Checked Before Dispatch, 💳 Secure QAR Payment & COD Options, 🔄 Easy 14-Day Return Protection).

#### C. Product Catalog / Listing Page (`app/(shop)/shop/page.tsx`)
1. **Interactive Faceted Filter Sidebar (Desktop sticky, Mobile slide-up sheet)**:
   - Category checkboxes with item counts, Price Range slider in `QAR` plus quick-tier pills (`Under QAR 50`, `QAR 50–150`, `QAR 150–300`, `QAR 300+`), Brand/Type filter, Discount percentage filter (`20% Off & more`), and Rating filter (`4★ & up`).
2. **Catalog Toolbar & Active Filter Pills**:
   - Result counter, removable active filter tags, "Clear All" action, Sort dropdown (Trending in Qatar, Price: Low to High, Price: High to Low, Biggest Discount, Top Rated), and 4-column Dense Grid vs. Compact List view toggle.
3. **Reusable `<ProductCard />` Component (Tuned for High Conversion)**:
   - Compact white card with crisp border, top-left Red discount badge (`-30%`), top-right Wishlist/Compare quick icons, hover image swap, Yellow star rating + sold count (e.g., `★ 4.8 (320 sold)`), bold `QAR` price with strikethrough original price, "✈️ 6–10 Days Delivery" pill, and responsive "Add to Cart" button.

#### D. Dynamic Product Detail Page (`app/(shop)/products/[slug]/page.tsx`)
1. **Media Gallery (Left Column)**:
   - Main high-res zoomable product stage + thumbnail strip + badge overlay ("Quality Inspected • Global Direct").
2. **Configuration & Buy Box (Right Column)**:
   - Brand/Category pill, SKU, review summary + total orders in Qatar, dynamic `QAR` pricing, Volume Discount tier box (e.g., "Buy 1: QAR 129 | Buy 2: QAR 115 each"), and interactive Color & Variant selectors.
   - **Interactive 6–10 Day Qatar Delivery Timeline Card**:
     - Select Municipality (Doha, Lusail, Al Rayyan, Al Wakrah, Al Khor) -> dynamically displays calculated date window (e.g., *Order Today -> Quality Check & Air Dispatch (Days 1–3) -> Arrival at Hamad Int'l Airport Customs (Days 4–6) -> Doorstep Delivery in Qatar (Days 6–10)*).
   - Dual CTAs: Primary Red "Add to Cart" + High-contrast Black/Yellow "Buy Now — Express Checkout".
3. **Tabbed Technical Information Section**:
   - Structured Specification Table (30% secondary alternating monochrome rows), Package Contents, Shipping & 14-Day Guarantee Policy, and Verified Customer Reviews with rating distribution bars.

#### E. Cart Page (`app/cart/page.tsx`) & Checkout Page (`app/checkout/page.tsx`)
1. **Cart Page**:
   - Line-item cards with variant badges, estimated 6–10 day arrival window per item, quantity controls, "Frequently Added Under QAR 35" impulse upsell carousel, and sticky Order Summary card with QAR subtotal, shipping fee calculator, coupon input, and Checkout CTA.
2. **Checkout Page (UI/UX Phase 1)**:
   - Clean 3-step visual flow: (1) Qatari Delivery Address following Qatar National Address format (Municipality, Zone No., Street No., Building No., Landmark, Mobile `+974`), (2) Shipping Option (`Standard Tracked Air: 6–10 Business Days` vs. `Priority Express Air: 5–7 Business Days`), (3) Payment Method Selector UI (Card, Apple Pay, Cash on Delivery) with order review summary.

#### F. Customer & Operations Dashboard (`app/dashboard/page.tsx`)
1. **Collapsible Dark Sidebar (`#0A0A0C`) + Clean White Workspace (`#F8F9FA`)**:
   - Role switcher toggle in header for previewing both **Customer Account View** and **Dropship Store Admin View**.
2. **Customer View Tabs**:
   - KPI summary cards (In-Transit Orders, Qatify Rewards Points, Saved Items), **5-Stage International Shipment Tracker** (`Order Confirmed` -> `Quality Checked & Packed` -> `Departed Global Air Hub` -> `Cleared Qatar Customs (DOH)` -> `Out for Final Delivery`), Return/Refund Requests, Saved Qatar Addresses (Zone/Street/Building), and Wishlist grid.
3. **Dropship Store Admin / Overview Tab**:
   - Revenue & Profit Margin in `QAR`, Daily Order Volume, Fulfillment Pipeline breakdown (Pending Supplier Dispatch, In Air Transit, Delivered in Qatar), and Recent Orders table with Red/Yellow/Black status pills.

### 8. Deliverables & Code Quality Requirements
1. Provide the complete SCSS token system (`_variables.scss`, `_mixins.scss`, `globals.scss`) first, tuned for medium-high visual density.
2. Create realistic, strongly-typed mock data (`types/product.ts` and `data/products.ts`) with at least 12 trending tech/gadget dropshipping products priced in `QAR`.
3. Build all shared components (`QatifyLogo`, `Navbar`, `Footer`, `ProductCard`, `CartDrawer`) and all 6 route pages (`Home`, `Shop Listing`, `Product Details`, `Cart`, `Checkout`, `Dashboard`) with production-ready Next.js + TypeScript + SCSS Modules.
4. Ensure pixel-perfect responsiveness across Mobile (`375px`), Tablet (`768px`), and Desktop (`1440px`), keyboard accessibility, and zero placeholder `TODO` blocks in critical UI flows.
```

## 2. Color Palette & 60/30/10 Token Reference

| Role & Proportion | Token Name | Hex Code | Primary UI Application |
| :--- | :--- | :--- | :--- |
| **60% Dominant Base** | `$color-bg-primary` | `#FFFFFF` | Main page background, product card canvas, clean reading surfaces |
| **60% Dominant Base** | `$color-bg-canvas` | `#F8F9FA` | App shell background for Shop, Cart, Checkout, and Dashboard views |
| **60% Dominant Base** | `$color-ink-black` | `#0A0A0C` | Primary headings, top utility bar, secondary nav strip, global footer |
| **30% Secondary Surface** | `$color-surface-muted` | `#F1F3F5` | Filter sidebars, specification table alternating rows, input backgrounds |
| **30% Secondary Surface** | `$color-surface-dark` | `#16161A` | Secondary bento cards, dashboard sidebar, dark promotional containers |
| **30% Secondary Surface** | `$color-border-subtle` | `#E4E4E7` | Card outlines, section dividers, table borders, inactive variant chips |
| **10% Accent (Red)** | `$color-accent-red` | `#E11D48` | Primary CTAs ("Add to Cart"), Flash Deal timers, discount badges (`-30%`), logo badge |
| **10% Accent (Red Hover)** | `$color-accent-red-dark` | `#BE123C` | Hover/active state for primary Red buttons and interactive links |
| **10% Accent (Yellow)** | `$color-accent-yellow` | `#FACC15` | "✈️ 6–10 Days Delivery" badges, star ratings, logo lightning mark, active focus highlights |
| **10% Accent (Yellow Soft)** | `$color-accent-yellow-tint` | `#FEF9C3` | Soft warning/highlight callout backgrounds and promo code badges |

## 3. Recommended Phased Execution Strategy

If you are generating the codebase inside an AI IDE (like Cursor or Windsurf), run the build in **4 focused iterations** so the AI writes full, non-truncated code for every file:

1. **Iteration 1 — Foundation, SCSS Design System & Global Layout**:
   - Ask the AI to generate `styles/_variables.scss`, `styles/_mixins.scss`, `styles/globals.scss`, `types/product.ts`, `data/products.ts` (in QAR with 6–10 day delivery metadata), `context/ShopContext.tsx`, `components/brand/QatifyLogo.tsx`, `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`, `components/cart/CartDrawer.tsx`, and `app/layout.tsx`.
2. **Iteration 2 — Dense Homepage & Reusable Product Card**:
   - Ask the AI to generate `components/product/ProductCard.tsx` and `app/(shop)/page.tsx` with its `page.module.scss` (3-Column Hero with Category Menu + Promo Cards, 2-Row Category Ribbon, 5-Col Flash Deals, and Dropship Assurance Strip).
3. **Iteration 3 — Product Listing (`/shop`) & Dynamic Product Details (`/products/[slug]`)**:
   - Ask the AI to generate `app/(shop)/shop/page.tsx` (interactive faceted filter sidebar, quick QAR price pills, 4-col dense grid toggle) and `app/(shop)/products/[slug]/page.tsx` (image gallery, bundle discount tiers, interactive 6–10 Day Qatar delivery timeline card, and specification tabs).
4. **Iteration 4 — Cart (`/cart`), Checkout (`/checkout`) & Dashboard (`/dashboard`)**:
   - Ask the AI to generate `app/cart/page.tsx`, `app/checkout/page.tsx` (with Qatari Zone/Street/Building address fields and 6–10 day shipping options), and `app/dashboard/page.tsx` (with 5-stage international shipment tracking and dropship store admin analytics).