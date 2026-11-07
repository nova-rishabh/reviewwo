import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';

/** Rename ({ id, name }) or remove ({ id, remove: true }) one of the signed-in user's cards. */
export async function POST(request) {
  const session = authenticateRequest(request);
  if (!session) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  try {
    const { id, name, remove } = await request.json();
    const cards = loadData('standees.json', []);
    const index = cards.findIndex((c) => c.id === id && c.userId === session.id);
    if (index === -1) return NextResponse.json({ error: 'Card not found.' }, { status: 404 });

    if (remove === true) {
      const [removed] = cards.splice(index, 1);
      saveData('standees.json', cards);
      return NextResponse.json({ success: true, removed: removed.id });
    }

    const clean = String(name || '').trim().slice(0, 60);
    if (!clean) return NextResponse.json({ error: 'Give the card a name.' }, { status: 400 });
    cards[index].name = clean;
    saveData('standees.json', cards);
    return NextResponse.json({ success: true, standee: cards[index] });
  } catch (err) {
    return NextResponse.json({ error: 'Could not update the card.' }, { status: 500 });
  }
}
