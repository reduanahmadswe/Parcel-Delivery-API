import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { UserController } from './user.controller';
import { toggleUserBlockStatusValidation, updateUserValidation, userIdValidation } from './user.validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User profile routes (accessible by all authenticated users)
router.get('/profile', UserController.getProfile);
router.patch('/profile', validateRequest(updateUserValidation), UserController.updateProfile);

// Admin only routes
router.use(authorize('admin'));
router.get('/', UserController.getAllUsers);
router.get('/stats', UserController.getUserStats);
router.get('/:id', validateRequest(userIdValidation), UserController.getUserById);
router.put('/:id', validateRequest(userIdValidation), validateRequest(updateUserValidation), UserController.updateUserById);
router.patch('/:id/block-status', validateRequest(userIdValidation), validateRequest(toggleUserBlockStatusValidation), UserController.toggleUserBlockStatus);
router.delete('/:id', validateRequest(userIdValidation), UserController.deleteUser);

export const userRoutes = router;
