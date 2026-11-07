import { NextResponse } from 'next/server';
import { loadData, saveData } from '../../../../src/lib/store.js';

export const dynamic = 'force-dynamic';

const DEMO = {
  name: 'The Corner Café',
  city: 'Bengaluru',
  category: 'cafe',
  placeId: '',
  cardName: 'Demo card',
};

/**
 * Public: looks up the business behind a card code for the customer review page.
 * GET /api/standees/resolve?code=ABC123&scan=1   (scan=1 counts a visit)
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get('code') || '').trim().toLowerCase();
  const countScan = searchParams.get('scan') === '1';

  if (!code) return NextResponse.json({ found: false }, { status: 404 });
  if (code === 'demo') return NextResponse.json({ found: true, demo: true, business: DEMO });

  const cards = loadData('standees.json', []);
  const card = cards.find((c) => String(c.shortCode || '').toLowerCase() === code);
  if (!card) return NextResponse.json({ found: false }, { status: 404 });

  const users = loadData('users.json', []);
  const owner = users.find((u) => u.id === card.userId);
  if (!owner) return NextResponse.json({ found: false }, { status: 404 });

  if (countScan) {
    card.scans = (card.scans || 0) + 1;
    card.lastScanAt = new Date().toISOString();
    saveData('standees.json', cards);
  }

  return NextResponse.json({
    found: true,
    demo: false,
    business: {
      name: owner.businessName || 'Our business',
      city: owner.city || '',
      category: owner.category || '',
      placeId: owner.googlePlaceId || '',
      cardName: card.name || '',
    },
  });
}
