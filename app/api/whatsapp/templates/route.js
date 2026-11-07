import { NextResponse } from 'next/server';
import { currentAdmin } from '../../../../src/lib/store.js';
import { waTransport } from '../../../../src/whatsapp/transport.js';

export async function GET(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  return NextResponse.json(waTransport.getTemplates());
}

export async function PUT(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  try {
    const updated = waTransport.saveTemplates(await request.json());
    return NextResponse.json({ success: true, templates: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Could not save templates.' }, { status: 500 });
  }
}
