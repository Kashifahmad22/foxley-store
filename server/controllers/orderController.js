import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` });
  res.json(order);
};
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const sig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  res.json({ valid: sig === razorpay_signature });
};
export const createOrder = async (req, res) => {
  const order = await Order.create({ ...req.body, user: req.user?.id });
  res.status(201).json(order);
};
export const myOrders = async (req, res) => res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 }));
export const allOrders = async (_req, res) => res.json(await Order.find().sort({ createdAt: -1 }));
export const updateOrderStatus = async (req, res) => res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
