const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, adminAuth, promoController.addPromo);
router.get('/', promoController.getPromos);
router.get('/all', auth, adminAuth, promoController.getAllPromos);

module.exports = router;