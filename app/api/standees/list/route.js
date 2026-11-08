import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';
import { withQr } from '../../../../src/lib/cards.js';

export async function GET(request) {
  const session = authenticateRequest(request);
  if (!session) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  try {
    const all = loadData('standees.json', []);
    let changed = false;
    const mine = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].userId !== session.id) continue;
      const res = await withQr(all[i]);
      if (res.changed) {
        all[i] = res.card;
        changed = true;
      }
      mine.push(all[i]);
    }
    if (changed) saveData('standees.json', all);
    mine.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return NextResponse.json(mine);
  } catch (err) {
    return NextResponse.json({ error: 'Could not load your QR codes.' }, { status: 500 });
  }
}
