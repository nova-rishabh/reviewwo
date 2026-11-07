import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'reviewwo_enterprise_sovereign_secret_2026';

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format. Expected Bearer <token>' });
  }

  const decoded = verifyToken(parts[1]);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  req.user = decoded;
  next();
}
