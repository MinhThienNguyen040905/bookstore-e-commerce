import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import { auth, adminAuth } from '../middleware/auth.js';

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/logout', auth, userController.signOut);
router.get('/', auth, adminAuth, userController.getUsers);

router.post('/request-otp', userController.requestOTP);
router.post('/verify-otp', userController.verifyOTP);
router.post('/register', userController.completeRegister);
router.post('/forgot-password', userController.requestOTP);
router.post('/reset-password', userController.resetPassword);

export default router;