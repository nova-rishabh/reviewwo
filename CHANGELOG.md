# Changelog

## 2026-11-08: Honest product, new design, security fixes

### Security
- Removed a hardcoded admin login that created an admin account with a known password, and cleared the seed account from `data/users.json`. That password was also published in this file; treat it as compromised and change or delete the account on any existing server.
- Cards, feedback and reviews are now visible only to the business that owns them.
- WhatsApp pairing, logs and message templates are admin-only (`ADMIN_EMAILS`). Merchants can only send a fixed test message to their own alert number.
- Billing reads the plan from the Razorpay order instead of trusting the browser, and ignores payments that were already applied.
- `JWT_SECRET` is required in production. Invalid sign-in cookies are cleared.
- WhatsApp sign-in codes only work for existing accounts. Redirects after sign-in stay on this site.

### Fixes
- Private feedback now actually sends a WhatsApp alert, and the dashboard shows whether it was delivered.
- Unknown card codes show "This card isn't set up yet" instead of another business's page.
- Card links use `APP_URL` at runtime, and scans are counted.
- Removed simulated WhatsApp pairing that reported a connection that did not exist.
- Card limits per plan are enforced.

### Product and design
- The customer page offers Google to every customer. Low ratings are also invited to message the manager, and that option is clearly labelled as private.
- New onboarding: business details, Google listing, alert number, first card.
- New design built around the NFC card. Removed emojis and claims the product does not support (zero SMS cost, AI drafting, automatic replies, Google partnership, review guarantees, multi-location plans).
- Responsive dashboard that fills the screen, with a slide-out menu on phones.
- Removed the old static HTML pages, CSS and JavaScript, and the fake-data seed script.

## Earlier history

See `git log` for commits before this entry.
