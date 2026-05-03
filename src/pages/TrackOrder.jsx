import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: Package, desc: 'We received your order' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, desc: 'Order confirmed & being packed' },
  { key: 'processing', label: 'Processing', icon: Clock, desc: 'Being prepared for dispatch' },
  { key: 'shipped', label: 'Shipped', icon: Truck, desc: 'On its way to you' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin, desc: 'Almost there!' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, desc: 'Enjoy your Foxley snacks! 🌿' },
];

export default function TrackOrder() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    const results = await base44.entities.Order.filter({ order_number: query.trim().toUpperCase() }, '-created_date', 1);
    if (results.length > 0) {
      setOrder(results[0]);
    } else {
      setError('No order found with that order number. Please check and try again.');
    }
    setLoading(false);
  };

  const currentStepIndex = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1;

  const statusColorClass = (status) => {
    if (status === 'cancelled') return 'text-destructive';
    if (status === 'delivered') return 'text-foxley-green';
    return 'text-foxley-orange';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-foxley-orange font-extrabold text-sm uppercase tracking-widest">Live Tracking</span>
        <h1 className="text-4xl font-black text-foxley-ink mt-1">Track Your Order</h1>
        <p className="text-muted-foreground mt-2">Enter your order number to get real-time updates</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter order number (e.g. FOX12345678)"
              className="w-full border border-border rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:border-foxley-green transition-colors"
            />
          </div>
          <button onClick={handleSearch} disabled={loading}
            className="bg-foxley-green text-white px-6 rounded-xl font-extrabold text-sm hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center gap-2">
            {loading ? '...' : <><Search className="w-4 h-4" /> Track</>}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3 text-destructive font-semibold text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {/* Order result */}
      {order && (
        <div className="space-y-4">
          {/* Order info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-extrabold text-xl text-foxley-ink">#{order.order_number}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{order.items?.length} item(s) · ₹{order.total}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-green-50 ${statusColorClass(order.status)}`}>
                {order.status?.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Shipping info */}
            {order.tracking_number && (
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-bold text-foxley-green">🚚 Tracking Number: <span className="font-extrabold">{order.tracking_number}</span></p>
                {order.courier_name && <p className="text-xs text-muted-foreground mt-1">Courier: {order.courier_name}</p>}
                {order.estimated_delivery && <p className="text-xs text-muted-foreground">Estimated Delivery: {order.estimated_delivery}</p>}
                {order.tracking_url && (
                  <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-foxley-green hover:underline mt-2">
                    Track on courier website →
                  </a>
                )}
              </div>
            )}

            {/* Progress steps */}
            {order.status !== 'cancelled' && (
              <div className="space-y-4">
                {STATUS_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= currentStepIndex;
                  const active = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${done ? 'bg-foxley-green text-white' : 'bg-muted text-muted-foreground'} ${active ? 'ring-4 ring-green-200' : ''}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${done ? 'text-foxley-ink' : 'text-muted-foreground'}`}>{step.label}</p>
                        <p className={`text-xs mt-0.5 ${active ? 'text-foxley-green font-semibold' : 'text-muted-foreground'}`}>{step.desc}</p>
                      </div>
                      {done && i < currentStepIndex && <span className="text-foxley-green text-xs font-bold mt-1">✓</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {order.status === 'cancelled' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-2 text-destructive font-semibold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" /> This order has been cancelled.
              </div>
            )}
          </div>

          {/* Items in order */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-base text-foxley-ink mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-xl shrink-0">
                    {item.product_image ? <img src={item.product_image} alt="" className="w-full h-full object-cover rounded-lg" /> : '🌿'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foxley-ink">{item.product_name}</p>
                    {item.weight && <p className="text-xs text-muted-foreground">{item.weight}</p>}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help text */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        Can't find your order? <a href="mailto:hello@foxley.in" className="text-foxley-green font-semibold hover:underline">Contact support</a>
      </p>
    </div>
  );
}