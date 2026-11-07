import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loadData, saveData, signToken } from '../../../../src/lib/store.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    let users = loadData('users.json', []);
    const cleanEmail = email.trim().toLowerCase();
    let userIndex = users.findIndex(u => u.email && u.email.toLowerCase() === cleanEmail);

    // Auto-seed admin if missing from disk on initial deployment
    if (userIndex === -1 && cleanEmail === 'admin@divergit.com') {
      const defaultAdmin = {
        id: 'usr_divergit_admin',
        name: 'Divergit Admin',
        businessName: 'Divergit',
        mobile: '+919876543210',
        email: 'admin@divergit.com',
        password: bcrypt.hashSync('Password123!', 10),
        plan: 'agency',
        planPrice: 799,
        createdAt: new Date().toISOString(),
        role: 'admin',
        googlePlaceId: '',
        googleRating: 5.0,
        reviewCount: 0
      };
      users.unshift(defaultAdmin);
      saveData('users.json', users);
      userIndex = 0;
    }

    if (userIndex === -1) {
      return NextResponse.json({ error: 'No account found with this email. Please register first.' }, { status: 401 });
    }

    const user = users[userIndex];
    const isBcrypt = user.password && user.password.startsWith('$2');
    const isValid = isBcrypt
      ? bcrypt.compareSync(password, user.password)
      : user.password === password;

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 });
    }

    // Auto-upgrade legacy plaintext passwords to bcrypt hash
    if (!isBcrypt && user.password) {
      user.password = bcrypt.hashSync(password, 10);
      users[userIndex] = user;
      saveData('users.json', users);
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      businessName: user.businessName,
      role: user.role || 'merchant',
      plan: user.plan || 'growth'
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        plan: user.plan,
        planPrice: user.planPrice || 299,
        role: user.role,
        googlePlaceId: user.googlePlaceId || ''
      }
    });

    response.cookies.set('rw_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
