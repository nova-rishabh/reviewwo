import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { loadData, saveData, publicUser, setAuthCookie, tokenFor } from '../../../../src/lib/store.js';

const GENERIC_ERROR = 'That email and password don’t match an account.';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
    }

    const users = loadData('users.json', []);
    const cleanEmail = String(email).trim().toLowerCase();
    const index = users.findIndex((u) => u.email && u.email.toLowerCase() === cleanEmail);
    const user = index === -1 ? null : users[index];

    if (!user || !user.password) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    const isBcrypt = user.password.startsWith('$2');
    const valid = isBcrypt ? bcrypt.compareSync(password, user.password) : user.password === password;
    if (!valid) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    // Upgrade legacy plaintext passwords to bcrypt.
    if (!isBcrypt) {
      users[index].password = bcrypt.hashSync(password, 10);
      saveData('users.json', users);
    }

    const response = NextResponse.json({ success: true, user: publicUser(user) });
    return setAuthCookie(response, tokenFor(user));
  } catch (err) {
    return NextResponse.json({ error: 'Sign-in failed. Please try again.' }, { status: 500 });
  }
}
