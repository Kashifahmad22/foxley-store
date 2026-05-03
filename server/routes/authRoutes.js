import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController.js';
const r = Router();
r.post('/register', [body('email').isEmail(), body('password').isLength({ min: 6 })], register);
r.post('/login', login);
export default r;
