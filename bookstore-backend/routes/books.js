const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, adminAuth, bookController.uploadCover, bookController.addBook);
router.get('/', bookController.getBooks);
// Add put/delete routes...

module.exports = router;