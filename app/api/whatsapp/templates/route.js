import { NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../src/lib/store.js';
import { waTransport } from '../../../../src/whatsapp/transport.js';

export async function GET(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(waTransport.getTemplates());
}

export async function PUT(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = waTransport.saveTemplates(body);
    return NextResponse.json({ success: true, templates: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
