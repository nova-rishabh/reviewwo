import { NextResponse } from 'next/server';
import { loadData, authenticateRequest } from '../../../../src/lib/store.js';

export async function GET(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const logs = loadData('shield_logs.json', []);
  return NextResponse.json(logs);
}
