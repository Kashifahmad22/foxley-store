import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Star } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_PRODUCT = {
  name: '', slug: '', short_description: '', description: '', price: '',
  compare_price: '', category: 'makhana', flavor: '', thumbnail: '',
  stock: 0, sku: '', is_active: true, is_featured: false, is_bestseller: false,
  halo_color: '#16A34A'
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.Product.list('-created_date', 100).then(setProducts).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setForm(EMPTY_PRODUCT); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, price: Number(form.price), compare_price: form.compare_price ? Number(form.compare_price) : undefined, stock: Number(form.stock) };
    if (editing) {
      await base44.entities.Product.update(editing, data);
      toast.success('Product updated!');
    } else {
      await base44.entities.Product.create(data);
      toast.success('Product created!');
    }
    setShowForm(false);
    load();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await base44.entities.Product.delete(id);
    toast.success('Deleted');
    load();
  };

  const toggleActive = async (p) => {
    await base44.entities.Product.update(p.id, { is_active: !p.is_active });
    load();
  };

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.flavor?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-foxley-ink">Products</h1>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-foxley-green text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-foxley-green" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3.5 font-bold text-foxley-ink text-xs uppercase">Product</th>
                <th className="text-left px-4 py-3.5 font-bold text-foxley-ink text-xs uppercase">Category</th>
                <th className="text-left px-4 py-3.5 font-bold text-foxley-ink text-xs uppercase">Price</th>
                <th className="text-left px-4 py-3.5 font-bold text-foxley-ink text-xs uppercase">Stock</th>
                <th className="text-left px-4 py-3.5 font-bold text-foxley-ink text-xs uppercase">Status</th>
                <th className="text-left px-4 py-3.5 font-bold text-foxley-ink text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center overflow-hidden shrink-0">
                        {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : <span className="text-lg">🌿</span>}
                      </div>
                      <div>
                        <div className="font-semibold text-foxley-ink">{p.name}</div>
                        {p.flavor && <div className="text-xs text-foxley-orange">{p.flavor}</div>}
                        <div className="flex gap-1 mt-0.5">
                          {p.is_bestseller && <span className="text-[10px] bg-orange-100 text-foxley-orange px-1.5 py-0.5 rounded font-bold">⭐ Best</span>}
                          {p.is_featured && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Featured</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 capitalize text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3.5 font-bold text-foxley-ink">
                    ₹{p.price}
                    {p.compare_price && <span className="text-xs text-muted-foreground line-through ml-1">₹{p.compare_price}</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`font-semibold ${(p.stock || 0) < 10 ? 'text-destructive' : 'text-foxley-green'}`}>{p.stock || 0}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${p.is_active ? 'bg-green-100 text-foxley-green' : 'bg-muted text-muted-foreground'}`}>
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:text-foxley-green transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => toggleActive(p)} className="p-1.5 hover:text-foxley-orange transition-colors">
                        {p.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-extrabold text-xl text-foxley-ink">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-lg">✕</button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {[
                { field: 'name', label: 'Product Name', type: 'text', span: 2 },
                { field: 'slug', label: 'URL Slug', type: 'text', span: 1 },
                { field: 'flavor', label: 'Flavor', type: 'text', span: 1 },
                { field: 'price', label: 'Price (₹)', type: 'number', span: 1 },
                { field: 'compare_price', label: 'MRP (₹)', type: 'number', span: 1 },
                { field: 'stock', label: 'Stock', type: 'number', span: 1 },
                { field: 'sku', label: 'SKU', type: 'text', span: 1 },
                { field: 'thumbnail', label: 'Thumbnail URL', type: 'text', span: 2 },
                { field: 'halo_color', label: 'Halo Color', type: 'color', span: 1 },
              ].map(({ field, label, type, span }) => (
                <div key={field} className={span === 2 ? 'sm:col-span-2' : ''}>
                  <label className="text-xs font-bold text-foxley-ink uppercase tracking-wide mb-1.5 block">{label}</label>
                  <input type={type} value={form[field] || ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-foxley-green" />
                </div>
              ))}

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-foxley-ink uppercase tracking-wide mb-1.5 block">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-foxley-green">
                  {['makhana', 'nuts', 'seeds', 'trail-mix', 'combos', 'gift-boxes'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3">
                {[
                  { field: 'is_active', label: 'Active' },
                  { field: 'is_featured', label: 'Featured' },
                  { field: 'is_bestseller', label: 'Bestseller' },
                ].map(({ field, label }) => (
                  <label key={field} className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}
                      className={`w-11 h-6 rounded-full transition-colors ${form[field] ? 'bg-foxley-green' : 'bg-muted'} relative`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[field] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm font-semibold text-foxley-ink">{label}</span>
                  </label>
                ))}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-foxley-ink uppercase tracking-wide mb-1.5 block">Description</label>
                <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-foxley-green resize-none" />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-foxley-green text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}