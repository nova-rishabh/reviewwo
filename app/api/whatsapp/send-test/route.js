import { NextResponse } from 'next/server';
import { authenticateRequest } from '../../../../src/lib/store.js';
import { waSocket } from '../../../../src/whatsapp/socketAdapter.js';

export async function POST(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { mobile, message } = body;
    const text = message || "Hello from Reviewwo QR! Your Unofficial WhatsApp Gateway is active with ₹0 SMS fees forever 🚀";
    const result = await waSocket.sendMessage(mobile, text, 'test_dispatch');
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
