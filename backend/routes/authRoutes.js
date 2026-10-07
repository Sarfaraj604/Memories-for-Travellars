import express from 'express';
import { login, logout, me, changePassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, changePasswordSchema } from '../validators/authSchema.js';

const router = express.Router();

// POST /api/auth/login is rate limited.
router.post('/login', loginLimiter, validate(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me requires auth.
router.get('/me', requireAuth, me);
router.post('/change-password', requireAuth, validate(changePasswordSchema), changePassword);

export default router;
