import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  confirmOrder,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Rotas de Pedidos
router.post('/checkout', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/confirm', confirmOrder);
router.put('/:id/cancel', cancelOrder);

export default router;
