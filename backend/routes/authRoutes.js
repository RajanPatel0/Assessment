import express from 'express';
import { 
    register, 
    login, 
    getUser, 
    logout, 
    refreshAccessToken 
} from '../controllers/authController.js';
import { userAuthMiddleware } from '../middleware/userAuthMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);        // both user & admin
router.post('/login', login);              // both user & admin
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.get('/profile', userAuthMiddleware, getUser);
router.post('/logout', userAuthMiddleware, logout);

export default router;