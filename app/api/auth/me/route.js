import { NextResponse } from 'next/server';
import { loadData, authenticateRequest } from '../../../../src/lib/store.js';

export async function GET(request) {
  const decoded = authenticateRequest(request);
  if (!decoded) {
    return NextResponse.json({ authenticated: false, error: 'Not authenticated.' }, { status: 401 });
  }

  const users = loadData('users.json', []);
  const currentUser = users.find(u => u.id === decoded.id) || decoded;

  return NextResponse.json({
    authenticated: true,
    user: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      businessName: currentUser.businessName,
      mobile: currentUser.mobile,
      plan: currentUser.plan || 'growth',
      planPrice: currentUser.planPrice || 299,
      role: currentUser.role || 'merchant',
      googlePlaceId: currentUser.googlePlaceId || ''
    }
  });
}
