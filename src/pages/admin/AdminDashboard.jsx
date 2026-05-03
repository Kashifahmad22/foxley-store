import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ShoppingCart, Package, TrendingUp, IndianRupee, ArrowUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Order.list('-created_date', 100),
      base44.entities.Product.list('-created_date', 50),
    ]).then(([o, p]) => {
      setOrders(o);
      setProducts(p);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => ['placed', 'confirmed', 'processing'].includes(o.status)).length;
  const activeProducts = products.filter(p => p.is_active).length;
  const todayOrders = orders.filter(o => new Date(o.created_date).toDateString() === new Date().toDateString()).length;

  // Last 7 days revenue chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const day = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const revenue = orders
      .filter(o => new Date(o.created_date).toDateString() === d.toDateString() && o.payment_status === 'paid')
      .reduce((s, o) => s + (o.total || 0), 0);
    return { day, revenue };
  });

  const recentOrders = orders.slice(0, 8);

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-green-50 text-foxley-green', trend: '+12%' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'bg-orange-50 text-foxley-orange', trend: '+8%' },
    { label: 'Pending Orders', value: pendingOrders, icon: TrendingUp, color: 'bg-amber-50 text-amber-600', trend: null },
    { label: 'Active Products', value: activeProducts, icon: Package, color: 'bg-blue-50 text-blue-600', trend: null },
  ];

  const statusBadge = (s) => {
    const map = {
      delivered: 'bg-green-100 text-foxley-green',
      placed: 'bg-orange-100 text-foxley-orange',
      shipped: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-destructive',
      processing: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-teal-100 text-teal-700',
    };
    return map[s] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foxley-ink">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">{todayOrders} new orders today</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
                </div>
                {stat.trend && (
                  <span className="flex items-center gap-0.5 text-xs font-bold text-foxley-green">
                    <ArrowUp className="w-3 h-3" />{stat.trend}
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-foxley-ink">{loading ? '...' : stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-extrabold text-foxley-ink mb-4">Revenue — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#16A34A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-extrabold text-foxley-ink mb-4">Recent Orders</h2>
          <div className="space-y-3 max-h-52 overflow-y-auto">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-foxley-ink">#{order.order_number}</span>
                  <span className="text-muted-foreground ml-2 text-xs">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">₹{order.total}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}