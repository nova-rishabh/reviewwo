# Reviewwo

Google review QR codes for local businesses. A customer scans the code, rates their visit, and can post a Google review in a few taps. Anyone can also send a private message to the manager, which is forwarded to the manager's WhatsApp. NFC cards that open the same page are an optional add-on (₹50 each plus delivery).

Live site: https://reviewwo.divergit.com

## How it works

- **Customer page** (`/r/<code>`): business name, a star rating, optional prompts for what to write, and a button that copies the text and opens the business's Google review form. Every customer is offered Google. People who rate 1 to 3 stars are also invited to message the manager first; that message is clearly labelled as private.
- **Feedback alerts**: private messages are saved to the business's feedback inbox and sent to the alert number on WhatsApp through one shared sender number that an admin links.
- **Dashboard**: overview, feedback inbox (resolve and reopen), QR codes (create, rename, remove, PNG and SVG downloads, scan counts), NFC card requests and settings.
- **Onboarding**: after sign-up, four steps collect the business details, Google Place ID, alert number and first QR code.
- **Coupons**: admins create codes in **Dashboard → Admin** that give a chosen plan free for a set number of months (or forever), with a usage limit. Users enter a code at sign-up (or via `/register?coupon=CODE`) or in Settings.
- **NFC card requests**: businesses request cards from **Dashboard → Order NFC cards**. No payment is taken online; admins see requests in **Dashboard → Admin**, confirm delivery and payment with the business, and update the status. The price is `NFC_CARD_PRICE` in `src/lib/nfc.js`.

## Running locally

```bash
npm install
```

```bash
npm run dev
```

The app runs on http://localhost:3000. Data is stored as JSON files in `data/` (or `DATA_DIR`).

## Environment variables

See `.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | Production | Signs sign-in cookies. Sign-in fails without it in production. |
| `APP_URL` | Yes | Public URL used in card links and QR codes. Changing it breaks cards that are already printed. |
| `SITE_URL` | Recommended | Canonical domain for SEO: canonical tags, sitemap and structured data. Defaults to `https://reviewwo.divergit.com`. Read at build time. |
| `ADMIN_EMAILS` | Yes | Comma-separated emails that can see the admin pages: coupons, NFC card requests and the WhatsApp sender. Sign up normally with one of these emails to become an admin. |
| `ORDER_ALERT_MOBILE` | Optional | WhatsApp number that gets a message for each new NFC card request. |
| `DATA_DIR` | Production | Folder on a persistent disk for JSON data and the WhatsApp session. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | For payments | Without them, subscribing shows a "payments aren't available yet" message. |

## Plans

QR code limits are enforced when a QR code is created and must stay in sync in three places: `CARD_LIMITS` in `src/lib/store.js`, `PLAN_PRICING` in `src/lib/razorpay.js`, and the pricing page.

| Plan | Monthly | Yearly (per month) | QR codes |
| --- | --- | --- | --- |
| Starter | ₹149 | ₹119 | 1 |
| Growth | ₹299 | ₹239 | 5 |
| Agency | ₹799 | ₹639 | 25 |

## WhatsApp

Alerts and sign-in codes are sent with Baileys, an unofficial WhatsApp Web client. One sender number serves every business. An admin links it from **Dashboard → WhatsApp sender**. Merchants only provide the number that receives alerts. WhatsApp can restrict numbers used this way, so the dashboard shows when the sender is offline and feedback is still saved to the inbox.

## Known gaps

- Google reviews are not imported, and replies are not posted to Google.
- Each business needs its own account; there is no multi-client agency login.
- Data is stored in JSON files, so the app runs on a single server.
