# Comprehensive Responsive UI & Cross-Device Audit

**Project**: Sri Vengamamba Tours & Travels  
**Target Viewports**:  
- **Mobile**: 320px, 360px, 375px, 390px, 414px, 430px  
- **Tablet**: 600px, 768px, 820px, 834px, 1024px  
- **Laptop**: 1280px, 1366px, 1440px  
- **Desktop & Ultra-wide**: 1536px, 1920px, 2560px  
**Goal**: Zero horizontal scroll, fluid typography, comfortable touch targets (≥44px), perfect readability, and visual integrity preserved across all device tiers.

---

## 1. Page & Route Inventory

| Page / Route | Template File | Key Layout Patterns | Responsive Risk Areas |
|---|---|---|---|
| **Home** (`/`) | `public/index.html` | Hero (100svh), Service Marquee, Preview Grids, Mosaic, About teaser, Review Marquee, Footer | Hero controls wrapping, Service strip text clipping, Review card width on 320px, Floating rail overlap |
| **Fleet & Tours** (`/services.html`) | `public/services.html` | Subpage Hero, Category Filter Tabs, 3-col Service Grid (15 cards), Action Buttons, Marquee, Footer | Card actions flex wrapping on small phones, Filter tabs line-wrap, Pill overflow |
| **Gallery** (`/gallery.html`) | `public/gallery.html` | Subpage Hero, 3-col Mosaic with 2-row feature tile, Lightbox modal, Marquee, Footer | Mosaic row heights on tablets/phones, Lightbox touch navigation, Modal close button reach |
| **About Us** (`/about.html`) | `public/about.html` | Subpage Hero, Story & Trust Card (2-col), 4 Core Principles grid, Marquee, Footer | Core principles `minmax(280px, 1fr)` overflow at 320px, Trust card stats alignment |
| **Reviews** (`/reviews.html`) | `public/reviews.html` | Subpage Hero, Verified Rating Badge, Dual Marquees, Feature Review highlights, Footer | Marquee card width at 320px, Rating badge stacking on mobile |
| **Contact & Bookings** (`/contact.html`) | `public/contact.html` | Subpage Hero, 2-col Contact Layout (Form + Desk/Map), 2-col Form Grid, Footer | Hardcoded inline `grid-template-columns: 1fr 1fr` on small viewports, 2-col form field squeeze |
| **404 Page** (`/404.html`) | `public/404.html` | Minimalist centered card with quick buttons | Button stacking at 320px |

---

## 2. Component-by-Component Responsive Audit

### 2.1 Navigation & Header (`.header`)
- **Desktop (≥1120px)**: Logo + 6 nav links + "PLAN YOUR TRIP ↗" CTA fit comfortably within `max-width: 1380px`.
- **Laptop / Small Desktop (960px–1120px)**: Nav links are close to the CTA button. Spacing needs fluid reduction.
- **Tablet (720px–960px)**: Currently displays hamburger menu, but drawer needs smooth animation, full touch targets, and outside-click dismissal.
- **Mobile (320px–720px)**: Header is fixed at `top: 14px; width: calc(100% - 28px)`.
  - *Risk*: At 320px, brand logo (`height: 34px`) + "PLAN YOUR TRIP" button + hamburger toggle can collide or squeeze the logo if the button text is too wide.
  - *Fix*: At ≤400px, shorten "PLAN YOUR TRIP ↗" to "BOOK ↗" or compact padding, preserving the full text inside the drawer menu.

### 2.2 Floating Social Rail (`.social-rail`)
- **Desktop**: Cleanly docks on right center (`top: 50%; transform: translateY(-50%)`).
- **Mobile (≤720px)**: Relocates to `bottom: 90px; right: 0`.
  - *Risk*: On phones, floating button rail can obscure card action buttons or form submit buttons when scrolling near the bottom.
  - *Fix*: Add `margin-right` safe spacing or subtle semi-transparent backdrop dock, plus `env(safe-area-inset-bottom)` support for iOS bottom bar.

### 2.3 Hero Sections
- **Homepage `.hero`**:
  - `h1`: `clamp(47px, 10.8vw, 134px)` is good, but on 320px screens it can wrap awkwardly if words break.
  - `.hero-bottom`: Needs clean vertical stacking on mobile with comfortable touch button.
  - `.hero-controls`: Bottom bar with slide dots and scroll cue must never overflow horizontally.
- **Subpage `.page-hero`**:
  - `h1`: `clamp(38px, 5vw, 72px)`. On 320px, 38px might cause long words like "Companions" to overflow if container padding is large.
  - `.page-hero-stats`: Flex container with stat pills. On mobile (≤600px), pills should wrap cleanly into vertical or 2-column flow without text clipping.

### 2.4 Service Cards & Grids (`.service-cards-grid`)
- **Desktop**: 3 columns (`repeat(3, 1fr)`).
- **Tablet (721px–1150px)**: 2 columns (`repeat(2, 1fr)`).
- **Mobile (≤720px)**: 1 column (`1fr`).
  - *Action Buttons (`.card-actions`)*: Features WhatsApp button (`.btn-whatsapp`) and direct Call button (`.btn-call`). At widths between 320px and 380px, ensure the buttons don't squeeze each other's text.

### 2.5 Contact Page Form & Layout (`contact.html`)
- **Root Issue**: Line 208 has hardcoded inline style:
  `style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start"`
  - On viewports < 960px, this squishes the WhatsApp booking form and the Office/Map card side-by-side into ~300px each.
  - On phones (< 600px), it completely breaks the layout unless converted to a responsive CSS class (`.contact-page-layout`) that switches to 1 column.
- **Form Grid (`.form-grid`)**:
  - Uses `grid-template-columns: 1fr 1fr; gap: 18px`.
  - On phones (< 560px), inputs become too narrow (< 130px) causing the date picker and dropdown selects to clip.
  - Must switch to 1 column on mobile (`grid-template-columns: 1fr`).

### 2.6 Core Pillars Grid (`about.html`)
- **Root Issue**: Line 251 has inline style:
  `style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-top:20px"`
  - At 320px screen width, `minmax(280px, 1fr)` combined with 6% page padding (19px * 2 = 38px) requires 318px minimum space, risking horizontal overflow by a few pixels.
  - Convert to `.pillar-cards-grid` with `grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr))`.

### 2.7 Gallery Mosaic & Lightbox (`gallery.html`)
- **Desktop**: 3 columns (`1.5fr 1fr 1fr`), feature tile spans 2 rows (`grid-row: span 2`).
- **Tablet (≤900px)**: 2 columns (`1fr 1fr`), feature tile spans 2 columns (`grid-column: 1 / -1`).
- **Mobile (≤560px)**: 1 column.
  - *Lightbox Modal*:
    - Prev / Next arrow buttons (`.lb-prev`, `.lb-next`) must be positioned safely within screen bounds on mobile without obstructing the image.
    - Close button (`.lb-close`) must have at least 44x44px touch target.
    - Swipe navigation must continue working smoothly.

### 2.8 Review Marquees (`.marquee-wrapper`, `.marquee-track`)
- Continuous CSS/JS ticker with clone cards.
- On small phones (320px–360px), `.review-card` is `flex: 0 0 380px` or `flex: 0 0 86vw`.
  - Ensure cards have `max-width: calc(100vw - 32px)` so a single card never exceeds the screen width.

### 2.9 Footer (`.site-footer`)
- **Desktop**: 4 columns (`1.7fr 1fr 1fr 1fr`).
- **Tablet (≤1000px)**: 2 columns (`1fr 1fr`).
- **Mobile (≤560px)**: 1 column (`1fr`).
  - Touch targets for phone links and social icons are well sized (40x40px).

---

## 3. Prioritized Implementation Plan

1. **Global Foundations**:
   - Establish fluid spacing and container utilities.
   - Prevent any element from causing horizontal scrollbar at `width: 320px`.
2. **Header & Navigation**:
   - Refine mobile toggle button and drawer menu.
   - Ensure outside clicks close the drawer.
   - Responsive CTA button at ≤400px screen width.
3. **Contact Page & Booking Form**:
   - Replace inline `1fr 1fr` grid with responsive class `.contact-page-layout`.
   - Responsive `.form-grid` (stack to 1 column below 600px).
4. **About Page Pillars**:
   - Replace inline `minmax(280px, 1fr)` with responsive `.pillar-cards-grid`.
5. **Subpage Hero Stat Pills**:
   - Ensure `.page-hero-stats` wraps fluidly and pills never overflow or collide on narrow screens.
6. **Card Action Buttons & Typography**:
   - Ensure `.card-actions` flexes or stacks gracefully on narrow devices.
   - Fine-tune `clamp()` font sizes for `h1`, `h2`, `h3` at 320px–430px.
7. **Lightbox & Modal Safety**:
   - Position touch controls comfortably on mobile.
8. **Automated Cross-Device QA & Validation**:
   - Test across 320px, 360px, 375px, 390px, 414px, 768px, 820px, 1024px, 1280px, 1440px, 1920px.
