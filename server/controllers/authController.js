import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

const sign = (u) => jwt.sign({ id: u._id, role: u.role, email: u.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
export const register = async (req, res) => {
  const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) return res.status(400).json({ message: 'Email exists' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: sign(user), user: { id: user._id, name, email, role: user.role } });
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: 'Invalid credentials' });
  res.json({ token: sign(user), user: { id: user._id, name: user.name, email, role: user.role } });
};
