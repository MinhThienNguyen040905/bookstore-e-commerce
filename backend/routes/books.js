import express from 'express';
const router = express.Router();
import bookController from '../controllers/bookController.js';
import { auth, adminAuth } from '../middleware/auth.js';

router.post('/', auth, adminAuth, bookController.uploadCover, bookController.addBook);
router.get('/', bookController.getBooks);
router.get('/new-releases', bookController.getNewReleases);
router.get('/top-rated', bookController.getTopRatedBooks);
router.get('/:id', bookController.getBookById);
// Add put/delete routes...

export default router;