import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number, price: Number, name: String }],
  total: Number,
  userInfo: { name: String, email: String, phone: String, address: String },
  status: { type: String, enum: ['pending','paid','shipped','delivered'], default: 'pending' },
  payment: { razorpayOrderId: String, razorpayPaymentId: String, razorpaySignature: String }
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);
