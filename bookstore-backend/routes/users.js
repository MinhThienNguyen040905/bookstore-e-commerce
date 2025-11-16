import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import { auth, adminAuth } from '../middleware/auth.js';

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/logout', auth, userController.signOut);
router.get('/', auth, adminAuth, userController.getUsers);

export default router;