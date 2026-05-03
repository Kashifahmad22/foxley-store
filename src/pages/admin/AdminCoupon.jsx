import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_COUPON = {
  code: '', description: '', discount_type: 'percentage', discount_value: '',
  min_order_value: '', max_discount: '', usage_limit: '', valid_from: '', valid_until: '', is_active: true
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_COUPON);
  const [saving, setSaving] = useState(false);

  const load = () => {
    base44.entities.Coupon.list('-created_date', 50).then(setCoupons).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Coupon.create({
      ...form,
      code: form.code.toUpperCase(),
      discount_value: Number(form.discount_value),
      min_order_value: Number(form.min_order_value || 0),
      max_discount: form.max_discount ? Number(form.max_discount) : undefined,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
    });
    toast.success('Coupon created!');
    setShowForm(false);
    setForm(EMPTY_COUPON);
    load();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await base44.entities.Coupon.delete(id);
    toast.success('Deleted');
    load();
  };

  const toggleActive = async (c) => {
    await base44.entities.Coupon.update(c.id, { is_active: !c.is_active });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-foxley-ink">Coupons</h1>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-foxley-green text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" /> New Coupon
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse"><div className="h-16 bg-muted rounded" /></div>
        )) : coupons.map(c => (
          <div key={c.id} className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${c.is_active ? 'border-foxley-green' : 'border-muted'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-foxley-green" />
                <span className="font-extrabold text-lg text-foxley-ink tracking-wider">{c.code}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(c)}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${c.is_active ? 'bg-green-100 text-foxley-green hover:bg-red-100 hover:text-destructive' : 'bg-muted text-muted-foreground hover:bg-green-100 hover:text-foxley-green'}`}>
                  {c.is_active ? 'Active' : 'Off'}
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{c.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="bg-green-50 text-foxley-green px-2.5 py-1 rounded-full">
                {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
              </span>
              {c.min_order_value > 0 && <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-full">Min ₹{c.min_order_value}</span>}
              {c.usage_limit && <span className="bg-orange-50 text-foxley-orange px-2.5 py-1 rounded-full">{c.used_count || 0}/{c.usage_limit} used</span>}
              {c.valid_until && <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-full">Expires {c.valid_until}</span>}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-extrabold text-xl text-foxley-ink">New Coupon</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { field: 'code', label: 'Coupon Code', type: 'text' },
                { field: 'description', label: 'Description', type: 'text' },
                { field: 'discount_value', label: 'Discount Value', type: 'number' },
                { field: 'min_order_value', label: 'Min Order Value (₹)', type: 'number' },
                { field: 'max_discount', label: 'Max Discount Cap (₹)', type: 'number' },
                { field: 'usage_limit', label: 'Usage Limit', type: 'number' },
                { field: 'valid_from', label: 'Valid From', type: 'date' },
                { field: 'valid_until', label: 'Valid Until', type: 'date' },
              ].map(({ field, label, type }) => (
                <div key={field}>
                  <label className="text-xs font-bold text-foxley-ink uppercase tracking-wide mb-1.5 block">{label}</label>
                  <input type={type} value={form[field] || ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-foxley-green" />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-foxley-ink uppercase tracking-wide mb-1.5 block">Discount Type</label>
                <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-foxley-green">
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2.5 bg-foxley-green text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-60">
                {saving ? 'Creating...' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}