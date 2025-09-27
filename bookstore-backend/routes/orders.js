const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getOrders);
router.get('/all', auth, adminAuth, orderController.getAllOrders);
router.put('/:order_id/status', auth, adminAuth, orderController.updateOrderStatus);

module.exports = router;