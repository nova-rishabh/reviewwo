import { NextResponse } from 'next/server';
import { loadData, authenticateRequest } from '../../../../src/lib/store.js';

export async function GET(request) {
  const session = authenticateRequest(request);
  if (!session) return NextResponse.json({ error: 'Sign in again to continue.' }, { status: 401 });

  const items = loadData('shield_logs.json', [])
    .filter((l) => l.userId === session.id)
    .map((l) => ({
      id: l.id,
      cardName: l.cardName || '',
      rating: l.rating,
      feedback: l.feedback,
      customerName: l.customerName || '',
      customerContact: l.customerContact || '',
      receivedAt: l.receivedAt || l.interceptedAt,
      status: l.status === 'resolved' ? 'resolved' : 'open',
      resolvedAt: l.resolvedAt || null,
      note: l.note || '',
      alert: l.alert || 'not_sent',
    }));
  return NextResponse.json(items);
}
