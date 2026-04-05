import express from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/productController.js';

const router = express.Router();

// Rotas de Produtos
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);

export default router;
