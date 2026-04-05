import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

// Rotas do Carrinho
router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove/:produtoId', removeFromCart);

export default router;
