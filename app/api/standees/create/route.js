import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';
import { withQr, newShortCode } from '../../../../src/lib/cards.js';

export async function POST(request) {
  const session = authenticateRequest(request);
  if (!session) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  try {
    const body = await request.json();
    const name = String(body.name || '').trim().slice(0, 60);
    if (!name) return NextResponse.json({ error: 'Give the card a name, such as “Front counter”.' }, { status: 400 });

    const cards = loadData('standees.json', []);
    const codes = new Set(cards.map((c) => String(c.shortCode || '').toLowerCase()));
    const base = {
      id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: session.id,
      name,
      format: 'nfc_card',
      shortCode: newShortCode(codes),
      scans: 0,
      createdAt: new Date().toISOString(),
    };
    const { card } = await withQr(base);
    cards.push(card);
    saveData('standees.json', cards);
    return NextResponse.json({ success: true, standee: card });
  } catch (err) {
    return NextResponse.json({ error: 'Could not create the card. Please try again.' }, { status: 500 });
  }
}
