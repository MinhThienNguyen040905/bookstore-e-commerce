import express from 'express';
const router = express.Router();
import orderController from '../controllers/orderController.js';
import { auth, adminAuth } from '../middleware/auth.js';

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getOrders);
router.get('/all', auth, adminAuth, orderController.getAllOrders);
router.put('/:order_id/status', auth, adminAuth, orderController.updateOrderStatus);

export default router;