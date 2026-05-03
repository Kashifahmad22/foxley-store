import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Truck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCart, updateQuantity, removeFromCart, getCartTotal, FREE_SHIPPING_THRESHOLD } from '@/lib/cart';

export default function CartDrawer({ open, onClose }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const update = () => setCart(getCart());
    update();
    window.addEventListener('cartUpdated', update);
    return () => window.removeEventListener('cartUpdated', update);
  }, []);

  const total = getCartTotal(cart);
  const shippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - total, 0);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-foxley-green" />
            <h2 className="font-extrabold text-lg text-foxley-ink">Your Bag ({cart.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping meter */}
        <div className="px-5 py-3 bg-green-50 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-foxley-green" />
            {remaining > 0 ? (
              <span className="text-xs font-semibold text-foxley-ink">
                Add <span className="text-foxley-green">₹{remaining}</span> more for FREE shipping!
              </span>
            ) : (
              <span className="text-xs font-bold text-foxley-green">🎉 You've unlocked FREE shipping!</span>
            )}
          </div>
          <div className="h-2 bg-green-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-foxley-green rounded-full transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
              <div>
                <p className="font-bold text-foxley-ink">Your bag is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add some guilt-free snacks!</p>
              </div>
              <button onClick={onClose}
                className="bg-foxley-green text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-700 transition-colors">
                Shop Now
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.key} className="flex gap-3 p-3 bg-muted/30 rounded-xl">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-green-100 flex items-center justify-center text-2xl">🌿</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foxley-ink truncate">{item.product_name}</p>
                  {item.weight && <p className="text-xs text-muted-foreground">{item.weight}</p>}
                  <p className="text-sm font-extrabold text-foxley-green mt-1">₹{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="w-7 h-7 bg-white border rounded-full flex items-center justify-center hover:border-foxley-green transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="w-7 h-7 bg-white border rounded-full flex items-center justify-center hover:border-foxley-green transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.key)}
                  className="p-1.5 hover:text-destructive transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-extrabold text-xl text-foxley-ink">₹{total.toFixed(0)}</span>
            </div>
            <Link to="/checkout" onClick={onClose}
              className="w-full bg-foxley-green text-white py-4 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
              Proceed to Checkout <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/shop" onClick={onClose}
              className="w-full text-center text-sm text-muted-foreground hover:text-foxley-ink transition-colors block">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}