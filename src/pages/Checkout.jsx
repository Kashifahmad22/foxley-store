import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, getCartTotal, clearCart, FREE_SHIPPING_THRESHOLD } from '@/lib/cart';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { ChevronRight, Tag, Truck, Shield, CreditCard } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [address, setAddress] = useState({
    name: '', phone: '', address_line1: '', address_line2: '',
    city: '', state: '', pincode: '', country: 'India'
  });
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const c = getCart();
    setCart(c);
    if (c.length === 0 && step !== 3) navigate('/shop');
  }, []);

  const subtotal = getCartTotal(cart);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const total = subtotal - discount + shipping;

  const applyCoupon = async () => {
    setCouponMsg('');
    const coupons = await base44.entities.Coupon.filter({ code: couponCode.toUpperCase(), is_active: true });
    if (coupons.length === 0) { setCouponMsg('❌ Invalid or expired coupon.'); return; }
    const coupon = coupons[0];
    if (subtotal < (coupon.min_order_value || 0)) {
      setCouponMsg(`❌ Min order ₹${coupon.min_order_value} required.`); return;
    }
    let d = coupon.discount_type === 'percentage'
      ? Math.min(subtotal * coupon.discount_value / 100, coupon.max_discount || Infinity)
      : coupon.discount_value;
    setDiscount(Math.round(d));
    setCouponMsg(`✅ ${coupon.description || `${coupon.discount_value}${coupon.discount_type === 'percentage' ? '%' : '₹'} off applied!`}`);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    const num = `FOX${Date.now().toString().slice(-8)}`;
    const order = await base44.entities.Order.create({
      order_number: num,
      customer_name: address.name,
      customer_phone: address.phone,
      customer_email: (await base44.auth.me())?.email || 'guest@foxley.in',
      items: cart,
      subtotal,
      discount,
      shipping_cost: shipping,
      total,
      coupon_code: couponCode || undefined,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'placed',
      shipping_address: address,
    });
    setOrderId(order.order_number || num);
    clearCart();
    setStep(3);
    setPlacing(false);
  };

  const updateAddress = (field, val) => setAddress(a => ({ ...a, [field]: val }));
  const addressComplete = ['name','phone','address_line1','city','state','pincode'].every(f => address[f]);

  if (step === 3) {
    return (
      <div className="min-h-screen bg-foxley-bone flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-foxley-ink">Order Placed!</h2>
          <p className="text-muted-foreground mt-2">Your order <span className="font-bold text-foxley-green">#{orderId}</span> is confirmed.</p>
          <div className="mt-6 bg-green-50 rounded-2xl p-5 text-left space-y-2">
            <p className="text-sm font-semibold text-foxley-ink">📦 What's next?</p>
            <p className="text-sm text-muted-foreground">You'll receive a confirmation email shortly. We'll notify you when it ships with a tracking link.</p>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/track" className="w-full bg-foxley-green text-white py-4 rounded-full font-extrabold text-sm hover:bg-green-700 transition-colors">
              Track My Order
            </Link>
            <Link to="/shop" className="w-full border border-border py-4 rounded-full font-bold text-sm hover:bg-muted transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-foxley-ink mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Delivery', 'Payment', 'Done'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold transition-all ${step > i + 1 ? 'bg-foxley-green text-white' : step === i + 1 ? 'bg-foxley-ink text-white' : 'bg-muted text-muted-foreground'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-semibold hidden sm:block ${step === i + 1 ? 'text-foxley-ink' : 'text-muted-foreground'}`}>{s}</span>
            {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 space-y-5">
              <h2 className="font-extrabold text-xl text-foxley-ink flex items-center gap-2">
                <Truck className="w-5 h-5 text-foxley-green" /> Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { field: 'name', label: 'Full Name', type: 'text', span: 1 },
                  { field: 'phone', label: 'Phone Number', type: 'tel', span: 1 },
                  { field: 'address_line1', label: 'Address Line 1', type: 'text', span: 2 },
                  { field: 'address_line2', label: 'Address Line 2 (Optional)', type: 'text', span: 2 },
                  { field: 'city', label: 'City', type: 'text', span: 1 },
                  { field: 'state', label: 'State', type: 'text', span: 1 },
                  { field: 'pincode', label: 'Pincode', type: 'text', span: 1 },
                  { field: 'country', label: 'Country', type: 'text', span: 1 },
                ].map(({ field, label, type, span }) => (
                  <div key={field} className={span === 2 ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-bold text-foxley-ink mb-1.5 block uppercase tracking-wide">{label}</label>
                    <input type={type} value={address[field]}
                      onChange={e => updateAddress(field, e.target.value)}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-foxley-green transition-colors" />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={!addressComplete}
                className="w-full bg-foxley-green text-white py-4 rounded-full font-extrabold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                Continue to Payment <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 space-y-5">
              <h2 className="font-extrabold text-xl text-foxley-ink flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-foxley-green" /> Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(pm => (
                  <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === pm.id ? 'border-foxley-green bg-green-50' : 'border-border hover:border-foxley-green/50'}`}>
                    <div className="text-2xl mb-1">{pm.icon}</div>
                    <div className="font-bold text-sm text-foxley-ink">{pm.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{pm.desc}</div>
                  </button>
                ))}
              </div>
              {paymentMethod === 'upi' && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700 font-semibold">
                  📱 You'll be redirected to complete UPI payment after placing order.
                </div>
              )}
              {paymentMethod === 'cod' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700 font-semibold">
                  💵 COD charges: ₹25 extra. Pay when your order arrives.
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-foxley-green" />
                Secured by Razorpay — 256-bit SSL encryption
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 border border-border py-4 rounded-full font-bold text-sm hover:bg-muted transition-colors">
                  Back
                </button>
                <button onClick={handlePlaceOrder} disabled={placing}
                  className="flex-1 bg-foxley-green text-white py-4 rounded-full font-extrabold text-sm hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {placing ? 'Placing...' : `Place Order — ₹${total}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-extrabold text-lg text-foxley-ink mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={item.key} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    {item.product_image ? (
                      <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foxley-ink truncate">{item.product_name}</p>
                    {item.weight && <p className="text-xs text-muted-foreground">{item.weight}</p>}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
              {/* Coupon */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="w-full border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-foxley-green" />
                </div>
                <button onClick={applyCoupon}
                  className="bg-foxley-ink text-white px-4 rounded-xl text-sm font-bold hover:bg-foxley-green transition-colors">
                  Apply
                </button>
              </div>
              {couponMsg && <p className="text-xs font-semibold">{couponMsg}</p>}

              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-foxley-green font-semibold">
                  <span>Discount</span><span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-foxley-green font-semibold">FREE</span> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-extrabold text-lg text-foxley-ink border-t border-border pt-2 mt-2">
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}