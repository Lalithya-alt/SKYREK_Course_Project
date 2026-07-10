import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { getAllOrders } from '../controllers/orderController.js';
import { updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// Route to create a new order
router.post('/create', createOrder);
router.get("/:pageNumber/:pageSize", getAllOrders);
router.put("/:orderId", updateOrderStatus);

export default router;