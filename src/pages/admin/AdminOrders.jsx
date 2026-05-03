import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, ChevronDown, Truck, X } from 'lucide-react';
import { toast } from 'sonner';

const STATUSES = ['all', 'placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
const STATUS_COLORS = {
  placed: 'bg-orange-100 text-foxley-orange',
  confirmed: 'bg-teal-100 text-teal-700',
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-blue-100 text-blue-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-foxley-green',
  cancelled: 'bg-red-100 text-destructive',
  returned: 'bg-gray-100 text-gray-600',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [trackingInput, setTrackingInput] = useState({ tracking_number: '', courier_name: '', tracking_url: '', estimated_delivery: '' });
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.Order.list('-created_date', 100).then(setOrders).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    await base44.entities.Order.update(orderId, { status: newStatus });
    toast.success(`Order status updated to ${newStatus}`);
    load();
    if (selected?.id === orderId) setSelected(prev => ({ ...prev, status: newStatus }));
  };

  const handleTrackingUpdate = async () => {
    setUpdating(true);
    await base44.entities.Order.update(selected.id, {
      ...trackingInput,
      status: 'shipped',
    });
    toast.success('Tracking info saved & order marked as shipped!');
    load();
    setSelected(null);
    setUpdating(false);
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.customer_email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-foxley-ink">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-foxley-green w-56" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.slice(0, 6).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${statusFilter === s ? 'bg-foxley-ink text-white' : 'bg-white border border-border hover:border-foxley-green'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5 font-bold text-xs uppercase text-foxley-ink">Order</th>
                <th className="text-left px-4 py-3.5 font-bold text-xs uppercase text-foxley-ink">Customer</th>
                <th className="text-left px-4 py-3.5 font-bold text-xs uppercase text-foxley-ink">Amount</th>
                <th className="text-left px-4 py-3.5 font-bold text-xs uppercase text-foxley-ink">Payment</th>
                <th className="text-left px-4 py-3.5 font-bold text-xs uppercase text-foxley-ink">Status</th>
                <th className="text-left px-4 py-3.5 font-bold text-xs uppercase text-foxley-ink">Date</th>
                <th className="text-left px-4 py-3.5 font-bold text-xs uppercase text-foxley-ink">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-foxley-ink">#{order.order_number}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold">{order.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                  </td>
                  <td className="px-4 py-3.5 font-bold">₹{order.total}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${order.payment_status === 'paid' ? 'bg-green-100 text-foxley-green' : order.payment_status === 'failed' ? 'bg-red-100 text-destructive' : 'bg-amber-100 text-amber-700'}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <select value={order.status} onChange={e => handleStatusUpdate(order.id, e.target.value)}
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status] || 'bg-muted text-muted-foreground'}`}>
                      {STATUSES.slice(1).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">
                    {new Date(order.created_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => { setSelected(order); setTrackingInput({ tracking_number: order.tracking_number || '', courier_name: order.courier_name || '', tracking_url: order.tracking_url || '', estimated_delivery: order.estimated_delivery || '' }); }}
                      className="flex items-center gap-1 text-xs font-bold text-foxley-green hover:underline">
                      <Truck className="w-3 h-3" /> Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-extrabold text-lg text-foxley-ink">Update Tracking — #{selected.order_number}</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { field: 'tracking_number', label: 'Tracking Number' },
                { field: 'courier_name', label: 'Courier Name' },
                { field: 'tracking_url', label: 'Tracking URL' },
                { field: 'estimated_delivery', label: 'Est. Delivery Date' },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="text-xs font-bold text-foxley-ink uppercase tracking-wide mb-1.5 block">{label}</label>
                  <input value={trackingInput[field]} onChange={e => setTrackingInput(t => ({ ...t, [field]: e.target.value }))}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-foxley-green" />
                </div>
              ))}
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted">Cancel</button>
              <button onClick={handleTrackingUpdate} disabled={updating}
                className="px-5 py-2.5 bg-foxley-green text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-60">
                {updating ? 'Saving...' : 'Save & Mark Shipped'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}