import { NextResponse } from 'next/server';
import { loadData, authenticateRequest } from '../../../../src/lib/store.js';

export async function GET(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reviews = loadData('reviews.json', []).filter((r) => r.userId === user.id);
  const avg = reviews.length ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1) : 5.0;

  return NextResponse.json({
    total: reviews.length,
    averageRating: avg,
    reviews
  });
}
