import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest } from '../../../../src/lib/store.js';

export async function POST(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, businessName, mobile, googlePlaceId } = await request.json();
    const users = loadData('users.json', []);
    const record = users.find(u => u.id === user.id);

    if (record) {
      if (name) record.name = name.trim();
      if (businessName) record.businessName = businessName.trim();
      if (mobile) record.mobile = mobile.trim();
      if (googlePlaceId !== undefined) record.googlePlaceId = googlePlaceId.trim();
      saveData('users.json', users);
    }

    return NextResponse.json({ success: true, user: record });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
