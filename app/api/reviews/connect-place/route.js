import { NextResponse } from 'next/server';
import { loadData, saveData, authenticateRequest, isValidPlaceId } from '../../../../src/lib/store.js';

export async function POST(request) {
  const user = authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { googlePlaceId, businessName } = await request.json();
    if (!isValidPlaceId(googlePlaceId)) {
      return NextResponse.json({ error: 'Enter a valid Google Place ID.' }, { status: 400 });
    }

    const users = loadData('users.json', []);
    const userRecord = users.find(u => u.id === user.id);
    if (userRecord) {
      userRecord.googlePlaceId = googlePlaceId.trim();
      if (businessName) userRecord.businessName = businessName.trim();
      saveData('users.json', users);
    }

    return NextResponse.json({
      success: true,
      googlePlaceId,
      message: 'Google Business Profile linked successfully.'
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
