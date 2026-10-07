import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import Admin from '../models/Admin.js';

export const generateTokens = (admin) => {
  const payload = { id: admin._id || admin.id, email: admin.email };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ ...payload, jti: crypto.randomUUID() }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const hashRefreshToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAMESITE || 'lax';
  const secure = isProd;
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const clearTokenCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAMESITE || 'lax';
  const secure = isProd;
  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite
  };
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

export const requireAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id).select('refreshTokenHash');
      if (!admin || !refreshToken || admin.refreshTokenHash !== hashRefreshToken(refreshToken)) {
        clearTokenCookies(res);
        return res.status(401).json({ message: 'Session revoked, please login again' });
      }
      req.admin = { id: decoded.id, email: decoded.email };
      return next();
    }
  } catch (error) {
    // Access token verification failed (likely expired). Continue to try refresh token.
  }

  if (!refreshToken) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const admin = await Admin.findById(decoded.id).select('email refreshTokenHash');
    if (!admin || !admin.refreshTokenHash || admin.refreshTokenHash !== hashRefreshToken(refreshToken)) {
      clearTokenCookies(res);
      return res.status(401).json({ message: 'Session expired, please login again' });
    }
    
    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens({
      id: decoded.id,
      email: decoded.email
    });
    admin.refreshTokenHash = hashRefreshToken(newRefreshToken);
    await admin.save();

    setTokenCookies(res, newAccessToken, newRefreshToken);

    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    clearTokenCookies(res);
    return res.status(401).json({ message: 'Invalid or expired token, please login again' });
  }
};

export default {
  generateTokens,
  setTokenCookies,
  clearTokenCookies,
  requireAuth
};
