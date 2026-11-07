# Reviewwo — Enterprise Google Review Acceleration Platform

A production-grade, deploy-ready **Next.js (App Router)** SaaS platform engineered to clone the capabilities of automated Google review acceleration platforms — built from scratch with an original design, custom King Rounded typography, bespoke branding, and zero references or cloned markup from any third party.

---

## 🎨 Brand Design System & Custom Typography

- **Brand Name**: **Reviewwo**
- **Headline & Brand Font**: **King Rounded** (Custom OTF font family: Regular, Extrabold, Extra-light)
- **Body Font**: **Inter** (Clean neutral editorial sans)
- **Strict 5-Color Palette**:

| Token | Hex Value | Role & Implementation |
|---|---|---|
| **Primary** | `#0B3D3B` | Deep Forest Emerald Teal — Headings, high-contrast buttons, dark container headers, primary text contrast. |
| **Accent** | `#14B8A6` | Vibrant Luminous Teal — Primary CTA gradients, active states, glowing badges, checkmarks, progress indicators. |
| **Secondary** | `#99F6E4` | Soft Mint / Aqua Pastel — Card highlight borders, secondary badges, subtle glow accents. |
| **Surface** | `#E6FFFB` | Ice Mint / Clean Surface — Card container tints, subtle badge backdrops, table headers, hover highlights. |
| **Background** | `#F8FFFE` | Crisp Mint-White — Pristine, modern base page background across all pages. |

---

## ⚡ The Frictionless 1-Tap In-Store Review Flow

1. **Guest Taps NFC Standee or Scans QR**: Launches in 0.2s without downloading any app or entering personal information.
2. **AI Generates Tailored 5-Star Draft**: Guest chooses highlights ("Crispy Fries", "Great Hospitality", "Fast Service").
3. **1-Tap Copy & Deep-Link**: 
   - Copies the drafted 5-star review directly to their device clipboard.
   - Automatically opens the store's verified Google Maps review dialogue (`https://search.google.com/local/writereview?placeid=...`).
   - Customer simply pastes and taps "Post" — complete in 12 seconds!

---

## 💬 The Two Exclusive Roles of the WhatsApp Socket

Reviewwo does **not** blast cold outbound marketing messages or chat drafts to customers. The sovereign multi-device WhatsApp socket is reserved exclusively for:

1. **Negative Review Shield Manager Alerts (1–3★ Deflection)**:
   - When a dissatisfied guest rates 1 to 3 stars on a counter standee, the feedback is intercepted privately and prevented from reaching Google.
   - The WhatsApp socket immediately triggers an automated high-priority alert to the **store manager’s personal phone**:  
     `"⚠️ Reviewwo Alert: Guest at Table 4 rated 2 stars. Feedback: 'Order took 25 mins'. Tap here to resolve privately before they leave."`
2. **Merchant Authentication (WhatsApp OTP)**:
   - Merchants sign in securely with 6-digit one-time passwords delivered via their connected WhatsApp socket with **₹0 SMS fees**.

---

## 🚀 Clean Production Routes (Zero `.html`)

- `/` — Modern Beehiiv-style landing page with live 1-tap review simulator and flywheel breakdown.
- `/features` — Feature breakdown: 1-Tap Google Deep-Link, Manager WhatsApp Rail, Negative Shield, and 24/7 Autopilot.
- `/pricing` — Starter (₹149/mo), Growth (₹299/mo), Agency (₹799/mo).
- `/standees` — Standee Hardware Studio: 7x5" Acrylic standees, 5x4" Table wedges, and NFC pucks.
- `/agency` — White-label reseller hub, 95%+ margin model, multi-tenant sub-accounts.
- `/login` — Enterprise sign-in with King Rounded typography: Email/Password & WhatsApp OTP tabs.
- `/register` — Account registration with business category and subscription plan selector.
- `/dashboard` — Executive overview, real Google Place ID sync status, scan velocity.
- `/dashboard/whatsapp` — Dedicated Manager WhatsApp Rail & Auth Gateway.
- `/dashboard/reviews` — Google Reviews management & 24/7 AI Autopilot auto-response engine.
- `/dashboard/standees` — Smart standees studio, shortcode generator, and vector SVG downloads.
- `/dashboard/shield` — Negative feedback shield logs and internal manager resolution workflow.
- `/dashboard/settings` — Business profile settings, Google Place ID linkage, and subscription tier switch.
