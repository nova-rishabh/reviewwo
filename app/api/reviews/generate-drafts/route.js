import { NextResponse } from 'next/server';
import { loadData } from '../../../../src/lib/store.js';
import { publicBusiness, keywordsFor, DEMO_OWNER } from '../../../../src/lib/branding.js';
import { aiEnabled, writeCustomerReview, fallbackReview } from '../../../../src/lib/ai.js';
import { hit, clientIp } from '../../../../src/lib/rateLimit.js';

export const dynamic = 'force-dynamic';

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

// Limits for this public endpoint. Each AI call costs money, so they are layered:
// per visitor (burst + daily), per QR code (hourly), and a server-wide daily cap.
const LIMITS = {
  ipBurst: { max: 5, window: 10 * MIN },
  ipDaily: { max: 20, window: DAY },
  codeHourly: { max: Number(process.env.AI_PER_CODE_HOURLY) || 120, window: HOUR },
  globalDaily: { max: Number(process.env.AI_DAILY_LIMIT) || 3000, window: DAY },
};

function tooMany(retryAfter, message = 'You’ve tried that a few times. Please write it yourself or try again in a few minutes.') {
  return NextResponse.json({ error: message }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
}

/**
 * Public: writes a review draft for the customer from the highlights they picked.
 * POST { code, rating, keywords: string[], notes?: string } -> { text, ai }
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const code = String(body.code || '').trim().toLowerCase().slice(0, 40);
  const rating = Math.round(Number(body.rating));
  const notes = String(body.notes || '').trim().slice(0, 600);
  if (!code) return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: 'Choose a rating first.' }, { status: 400 });

  let owner;
  let card = null;
  if (code === 'demo') {
    owner = DEMO_OWNER;
  } else {
    const cards = loadData('standees.json', []);
    card = cards.find((c) => String(c.shortCode || '').toLowerCase() === code);
    const users = loadData('users.json', []);
    owner = card ? users.find((u) => u.id === card.userId) : null;
    if (!owner) return NextResponse.json({ error: 'This code is no longer active.' }, { status: 404 });
  }

  // Only the owner's own highlights are accepted, so the endpoint can't be used as a free text generator.
  const allowed = new Map(keywordsFor(owner).map((k) => [k.toLowerCase(), k]));
  const keywords = (Array.isArray(body.keywords) ? body.keywords : [])
    .map((k) => allowed.get(String(k || '').trim().toLowerCase()))
    .filter(Boolean)
    .slice(0, 8);

  if (!keywords.length && !notes) {
    return NextResponse.json({ error: 'Pick at least one highlight first.' }, { status: 400 });
  }

  const business = publicBusiness(owner, card);

  if (!aiEnabled()) {
    return NextResponse.json({ text: fallbackReview({ business, keywords, notes }), ai: false });
  }

  const ip = clientIp(request);
  for (const [key, limit] of [
    [`ai:ip:${ip}`, LIMITS.ipBurst],
    [`ai:ipday:${ip}`, LIMITS.ipDaily],
    [`ai:code:${code}`, LIMITS.codeHourly],
  ]) {
    const r = hit(key, limit.max, limit.window);
    if (!r.ok) return tooMany(r.retryAfter);
  }
  const g = hit('ai:global', LIMITS.globalDaily.max, LIMITS.globalDaily.window);
  if (!g.ok) {
    // Budget spent for today: still give the customer something usable.
    return NextResponse.json({ text: fallbackReview({ business, keywords, notes }), ai: false });
  }

  try {
    const text = await writeCustomerReview({ business, rating, keywords, notes });
    if (!text) return NextResponse.json({ text: fallbackReview({ business, keywords, notes }), ai: false });
    return NextResponse.json({ text, ai: true });
  } catch (err) {
    console.error('[ai] review draft failed:', err?.status || '', err?.message || err);
    return NextResponse.json({ text: fallbackReview({ business, keywords, notes }), ai: false });
  }
}
