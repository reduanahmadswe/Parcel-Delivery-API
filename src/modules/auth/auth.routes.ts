import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { createUserValidation, loginValidation } from '../user/user.validation';
import { AuthController } from './auth.controller';

const router = Router();

// Public routes
router.post('/register', validateRequest(createUserValidation), AuthController.register);
router.post('/login', validateRequest(loginValidation), AuthController.login);

// Protected routes
router.use(authenticate);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/me', AuthController.me);

export const authRoutes = router;
