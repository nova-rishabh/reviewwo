# Reviewwo

NFC review cards for local businesses. A customer taps the card (or scans its QR code), rates their visit, and can post a Google review in a few taps. Anyone can also send a private message to the manager, which is forwarded to the manager's WhatsApp.

Live site: https://reviewwo.divergit.com

## How it works

- **Customer page** (`/r/<code>`): business name, a star rating, optional prompts for what to write, and a button that copies the text and opens the business's Google review form. Every customer is offered Google. People who rate 1 to 3 stars are also invited to message the manager first; that message is clearly labelled as private.
- **Feedback alerts**: private messages are saved to the business's feedback inbox and sent to the alert number on WhatsApp through one shared sender number that an admin links.
- **Dashboard**: overview, feedback inbox (resolve and reopen), cards (create, rename, remove, PNG and SVG QR downloads, scan counts) and settings.
- **Onboarding**: after sign-up, four steps collect the business details, Google Place ID, alert number and first card.

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
| `ADMIN_EMAILS` | Yes | Comma-separated emails that can see the WhatsApp sender page. |
| `DATA_DIR` | Production | Folder on a persistent disk for JSON data and the WhatsApp session. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | For payments | Without them, subscribing shows a "payments aren't available yet" message. |

## Plans

Card limits are enforced when a card is created and must stay in sync in three places: `CARD_LIMITS` in `src/lib/store.js`, `PLAN_PRICING` in `src/lib/razorpay.js`, and the pricing page.

| Plan | Monthly | Yearly (per month) | Cards |
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
