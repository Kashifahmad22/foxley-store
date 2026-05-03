import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ProductCard from '@/components/products/ProductCard';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Makhana', value: 'makhana' },
  { label: 'Nuts & Seeds', value: 'nuts' },
  { label: 'Trail Mix', value: 'trail-mix' },
  { label: 'Combos', value: 'combos' },
  { label: 'Gift Boxes', value: 'gift-boxes' },
];

const SORTS = [
  { label: 'Featured', value: '-sort_order' },
  { label: 'Newest', value: '-created_date' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Top Rated', value: '-rating' },
];

export default function Shop() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(params.get('category') || '');
  const [sort, setSort] = useState('-sort_order');
  const [search, setSearch] = useState(params.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [onlyBestseller, setOnlyBestseller] = useState(params.get('filter') === 'bestseller');

  useEffect(() => {
    setLoading(true);
    const filter = { is_active: true };
    if (category) filter.category = category;
    if (onlyBestseller) filter.is_bestseller = true;

    base44.entities.Product.filter(filter, sort, 50)
      .then(data => {
        let filtered = data;
        if (search) {
          const q = search.toLowerCase();
          filtered = data.filter(p =>
            p.name?.toLowerCase().includes(q) ||
            p.flavor?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
          );
        }
        filtered = filtered.filter(p => (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1]);
        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [category, sort, search, onlyBestseller, priceRange]);

  const clearFilters = () => {
    setCategory('');
    setSearch('');
    setOnlyBestseller(false);
    setPriceRange([0, 2000]);
  };

  const activeFilterCount = [category, search, onlyBestseller].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <span className="text-foxley-orange font-extrabold text-sm uppercase tracking-widest">The Store</span>
        <h1 className="text-4xl md:text-5xl font-black text-foxley-ink mt-1">
          {search ? `Results for "${search}"` : 'All Snacks'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {loading ? 'Loading...' : `${products.length} products`}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${category === cat.value
              ? 'bg-foxley-green text-white shadow-md'
              : 'bg-white text-foxley-ink hover:border-foxley-green border border-border'}`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-full text-sm font-semibold hover:border-foxley-green transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-foxley-orange text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{activeFilterCount}</span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="text-sm font-semibold bg-white border border-border rounded-full px-4 py-2.5 outline-none hover:border-foxley-green cursor-pointer">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-border rounded-2xl p-6 mb-6 grid sm:grid-cols-3 gap-6">
          <div>
            <label className="font-bold text-sm text-foxley-ink mb-2 block">Bestsellers Only</label>
            <button onClick={() => setOnlyBestseller(!onlyBestseller)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${onlyBestseller ? 'bg-foxley-orange text-white' : 'border border-border hover:border-foxley-orange'}`}>
              ⭐ Bestsellers
            </button>
          </div>
          <div>
            <label className="font-bold text-sm text-foxley-ink mb-2 block">Search</label>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by flavor, name..."
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-foxley-green" />
          </div>
          <div className="flex items-end">
            {activeFilterCount > 0 && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm font-semibold text-destructive hover:underline">
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-foxley-ink">No snacks found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
          <button onClick={clearFilters} className="mt-4 bg-foxley-green text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-700 transition-colors">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}