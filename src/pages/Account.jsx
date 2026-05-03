import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { User, Package, MapPin, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';

export default function Account() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.auth.me(),
    ]).then(([u]) => {
      setUser(u);
      return base44.entities.Order.filter({ customer_email: u.email }, '-created_date', 10);
    }).then(setOrders).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => base44.auth.logout('/');

  const statusColor = (s) => {
    const map = { delivered: 'text-foxley-green bg-green-50', placed: 'text-foxley-orange bg-orange-50', shipped: 'text-blue-600 bg-blue-50', cancelled: 'text-destructive bg-red-50', processing: 'text-amber-600 bg-amber-50' };
    return map[s] || 'text-muted-foreground bg-muted';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-foxley-green/20 border-t-foxley-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center text-2xl font-black text-foxley-green">
            {user?.full_name?.[0] || user?.email?.[0] || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-foxley-ink">{user?.full_name || 'My Account'}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {[
          { id: 'orders', label: 'My Orders', IconComp: Package },
          { id: 'profile', label: 'Profile', IconComp: User },
        ].map(({ id, label, IconComp }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all ${tab === id ? 'border-b-2 border-foxley-green text-foxley-green' : 'text-muted-foreground hover:text-foxley-ink'}`}>
            <IconComp className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-bold text-foxley-ink text-xl">No orders yet</h3>
              <p className="text-muted-foreground mt-2">Start snacking guilt-free!</p>
              <Link to="/shop" className="mt-4 inline-block bg-foxley-green text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-700 transition-colors text-sm">
                Shop Now
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-extrabold text-foxley-ink">#{order.order_number}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${statusColor(order.status)}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.items?.length} item(s) · ₹{order.total}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {order.tracking_number && (
                      <Link to={`/track`}
                        className="flex items-center gap-1 text-xs font-bold text-foxley-green hover:underline">
                        Track <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
                {/* Items preview */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <div key={i} className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-xl shrink-0">
                      {item.product_image ? <img src={item.product_image} alt="" className="w-full h-full object-cover rounded-lg" /> : '🌿'}
                    </div>
                  ))}
                  {(order.items?.length || 0) > 4 && (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 max-w-md space-y-4">
          <h3 className="font-extrabold text-xl text-foxley-ink">Profile Info</h3>
          <div>
            <label className="text-xs font-bold text-foxley-ink uppercase tracking-wide mb-1.5 block">Full Name</label>
            <input defaultValue={user?.full_name || ''} readOnly
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-muted/30" />
          </div>
          <div>
            <label className="text-xs font-bold text-foxley-ink uppercase tracking-wide mb-1.5 block">Email</label>
            <input defaultValue={user?.email || ''} readOnly
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-muted/30" />
          </div>
          <p className="text-xs text-muted-foreground">To update your profile details, contact support.</p>
        </div>
      )}
    </div>
  );
}