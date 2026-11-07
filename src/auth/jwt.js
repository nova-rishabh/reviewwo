import jwt from 'jsonwebtoken';

const DEV_FALLBACK_SECRET = 'reviewwo-local-dev-only-secret';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production.');
  }
  return DEV_FALLBACK_SECRET;
}

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, getSecret(), { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch (err) {
    return null;
  }
}
