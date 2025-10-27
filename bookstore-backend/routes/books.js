import express from 'express';
const router = express.Router();
import bookController from '../controllers/bookController.js';
import { auth, adminAuth } from '../middleware/auth.js';

router.post('/', auth, adminAuth, bookController.uploadCover, bookController.addBook);
router.get('/', bookController.getBooks);
// Add put/delete routes...

export default router;