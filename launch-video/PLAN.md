# Reviewwo launch film — director's plan

**Story in one line:** a happy customer scans a QR code at Asha's Coffee House, taps five stars, taps
two highlights, presses Use AI, and a ready-to-post review appears. One tap and it's posted.
Then we show what else the owner gets: unhappy feedback on WhatsApp, their own branding, NFC tap cards,
and a price that makes it a no-brainer.

**Customer example carried through:** Asha's Coffee House, Pune (invented, same as the test account).

## Format
- DECISION: one film, two renders from the same `seek(t)`:
  - 1080×1920 vertical (WhatsApp groups: full-screen on phones), 30 fps, small file.
  - 1920×1080 landscape (homepage), 60 fps; captions sit left of the action instead of above it.
- DECISION: ~33 s. Fast, one idea per scene, something on every beat.

## Music
- DECISION: "EDM Sample 2" by Cloud-10 (CC0, Freesound 536163 via Openverse).
  Measured: 152.8 BPM (half-time feel 76), beat 0 at 0.028 s, quiet intro, drop at beat 32 (12.594 s),
  extra lift around beat 58. Song starts at 0; film time = song time.
- Ending: last slam on beat 76, music fades over the final 1.5 s.

## Sound effects
- Real CC0 sounds from Openverse (per CLAUDE.md), in `sounds/` with `sounds/CREDITS.json`.
  Each one is placed so its loudest sample lands on the exact frame of its motion.

## Look
- Reviewwo brand: canvas #F2F5F4, teal #0B3D3B / #14B8A6, marigold stars #F2B705, ink #13201F.
- Display type King Rounded (brand font), UI type Instrument Sans.
- No glows, no particles, no bouncy easing. Springs with a tiny overshoot. One shape, never cut.

## Beat sheet (B = beat, 0.3927 s)
| Beats | Time | Scene | Takeaway |
|---|---|---|---|
| 0–7 | 0–3.1 | Hook: "Happy customers" / "rarely" / "leave reviews." slam on beats; a teal pill is born under them | The problem |
| 8–15 | 3.1–6.3 | Pill → QR standee; QR draws in; cursor ("You") scans; scan frame snaps; beep | Scan a QR |
| 16–23 | 6.3–9.4 | QR → phone review page (logo, Asha's Coffee House). Drag across stars, one per beat | Tap 5 stars |
| 24–31 | 9.4–12.6 | Highlight chips pop on 8ths; tap 2; press **Use AI**; review streams in over the build | AI writes it |
| 32–39 | 12.6–15.7 | DROP: tap "Post review" → button becomes the posted 5★ review; pull back to a wall of reviews | It's posted |
| 40–47 | 15.7–18.9 | Back to one card; a 2★ visit → "What could we do better?" → typed → sent → owner's WhatsApp alert | You hear it first |
| 48–55 | 18.9–22.0 | Alert → branding panel; drag the colour slider, the page recolours live; logo drops in | Your brand |
| 56–63 | 22.0–25.2 | Panel → NFC card; phone taps it; ripples on beats | Scan or tap |
| 64–79 | 25.2–31.4 | Card → Reviewwo mark; wordmark; "More 5★ Google reviews" / "From ₹149/month" / URL, boom boom | Get it |

## Real vs invented
- Real: product flow and screens, brand, price (₹149/month Starter), URL, features.
- Invented: Asha's Coffee House, the review text, the wall of reviews and its rating badge (illustrative).
