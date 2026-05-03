import { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/auth.js';
const r = Router();
r.get('/', getProducts); r.get('/:id', getProductById);
r.post('/', protect, adminOnly, createProduct);
r.put('/:id', protect, adminOnly, updateProduct);
r.delete('/:id', protect, adminOnly, deleteProduct);
export default r;
