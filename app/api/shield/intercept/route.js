import { NextResponse } from 'next/server';
import { loadData, saveData, normalizeMobile } from '../../../../src/lib/store.js';
import { waTransport } from '../../../../src/whatsapp/transport.js';

// Basic per-IP rate limit for this public endpoint.
const hits = globalThis.__rwFeedbackHits || (globalThis.__rwFeedbackHits = new Map());
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

/** Public: a customer sends private feedback to the business from the card page. */
export async function POST(request) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
    if (limited(ip)) {
      return NextResponse.json({ error: 'Too many messages. Please try again in a few minutes.' }, { status: 429 });
    }

    const body = await request.json();
    const code = String(body.code || '').trim().toLowerCase();
    const rating = Math.round(Number(body.rating));
    const feedback = String(body.feedback || '').trim().slice(0, 1000);
    const customerName = String(body.name || '').trim().slice(0, 80);
    const customerContact = String(body.contact || '').trim().slice(0, 40);

    if (!feedback) return NextResponse.json({ error: 'Write a short message first.' }, { status: 400 });
    if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: 'Choose a rating first.' }, { status: 400 });

    if (code === 'demo') return NextResponse.json({ success: true, demo: true });

    const cards = loadData('standees.json', []);
    const card = cards.find((c) => String(c.shortCode || '').toLowerCase() === code);
    const users = loadData('users.json', []);
    const owner = card ? users.find((u) => u.id === card.userId) : null;
    if (!card || !owner) return NextResponse.json({ error: 'This code is no longer active.' }, { status: 404 });

    const entry = {
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: owner.id,
      cardId: card.id,
      cardName: card.name || '',
      rating,
      feedback,
      customerName,
      customerContact,
      receivedAt: new Date().toISOString(),
      status: 'open',
      alert: 'not_sent',
    };

    const alertTo = normalizeMobile(owner.alertMobile || owner.mobile);
    if (alertTo) {
      try {
        const result = await waTransport.sendFeedbackAlert(alertTo, {
          businessName: owner.businessName,
          stars: rating,
          where: card.name,
          customerName,
          customerContact,
          feedback,
        });
        entry.alert = result?.delivered ? 'sent' : 'failed';
      } catch (e) {
        entry.alert = 'failed';
      }
    }

    const log = loadData('shield_logs.json', []);
    log.unshift(entry);
    saveData('shield_logs.json', log);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Your message could not be sent. Please try again.' }, { status: 500 });
  }
}
