import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import { generateTokens, setTokenCookies, clearTokenCookies, hashRefreshToken } from '../middleware/auth.js';

/**
 * POST /api/auth/login
 * Authenticate admin and set JWT cookies
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate tokens and set cookies
    const { accessToken, refreshToken } = generateTokens(admin);
    admin.refreshTokenHash = hashRefreshToken(refreshToken);
    await admin.save();
    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Clear auth cookies
 */
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        await Admin.findByIdAndUpdate(decoded.id, { $set: { refreshTokenHash: null } });
      } catch { /* Expired or invalid sessions are still cleared. */ }
    }
  } catch (error) {
    return next(error);
  }
  clearTokenCookies(res);
  res.json({ message: 'Logged out successfully' });
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!admin || !(await admin.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    await admin.setPassword(newPassword);
    admin.refreshTokenHash = null;
    await admin.save();
    clearTokenCookies(res);
    res.json({ message: 'Password changed. Please sign in again.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Return current admin info (requires auth)
 */
export const me = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      lastLogin: admin.lastLogin,
    });
  } catch (error) {
    next(error);
  }
};

export default { login, logout, me };
