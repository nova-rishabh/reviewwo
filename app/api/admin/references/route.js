import { NextResponse } from 'next/server';
import { currentAdmin } from '../../../../src/lib/store.js';
import { referenceReport, createReference, setReferenceActive } from '../../../../src/lib/references.js';

export const dynamic = 'force-dynamic';

/** Admin: reference codes with the businesses that used each one. */
export async function GET(request) {
  if (!currentAdmin(request)) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  return NextResponse.json(referenceReport());
}

/** Admin: create a code ({ code?, owner, contact?, note? }) or turn one on/off ({ code, active }). */
export async function POST(request) {
  const admin = currentAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  try {
    const body = await request.json();
    if (typeof body.active === 'boolean') {
      const ref = setReferenceActive(body.code, body.active);
      return NextResponse.json({ success: true, reference: ref });
    }
    const ref = createReference({ ...body, createdBy: admin.email });
    return NextResponse.json({ success: true, reference: ref });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Could not save the reference code.' }, { status: 400 });
  }
}
