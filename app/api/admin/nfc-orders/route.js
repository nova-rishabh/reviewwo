import { NextResponse } from 'next/server';
import { loadData, currentAdmin } from '../../../../src/lib/store.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  return NextResponse.json(loadData('nfc_orders.json', []));
}
