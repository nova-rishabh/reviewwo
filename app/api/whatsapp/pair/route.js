import { NextResponse } from 'next/server';

// Simulated pairing was removed: it reported a connection that did not exist.
export async function POST() {
  return NextResponse.json({ error: 'Use the QR code or pairing code to link WhatsApp.' }, { status: 410 });
}
