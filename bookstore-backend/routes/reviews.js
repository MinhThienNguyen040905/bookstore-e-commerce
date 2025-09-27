const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, reviewController.addReview);
router.get('/book/:book_id', reviewController.getReviewsByBook);
router.get('/all', auth, adminAuth, reviewController.getAllReviews);

module.exports = router;