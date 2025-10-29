import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { createUserValidation, loginValidation } from '../user/user.validation';
import { AuthController } from './auth.controller';

const router = Router();

// Public routes (no authentication required)

// Check if email exists
router.get('/check-email', AuthController.checkEmailExists);

router.post('/register', validateRequest(createUserValidation), AuthController.register);
router.post('/login', validateRequest(loginValidation), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);

// Protected routes (authentication required)
router.get('/me', authenticate, AuthController.me);

export const authRoutes = router;
