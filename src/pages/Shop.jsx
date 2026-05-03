import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '@/lib/products';

export default function Shop() {
  const [query, setQuery] = useState('');
  const products = useMemo(() => getAllProducts().filter((p) => p.name.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-4">Shop</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="border rounded-lg px-3 py-2 mb-6 w-full max-w-sm" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p.id} to={`/product/${p.slug}`} className="bg-white rounded-xl p-3">
            <img src={p.thumbnail} alt={p.name} className="aspect-square w-full object-cover rounded-lg" />
            <p className="font-bold mt-2">{p.name}</p>
            <p>₹{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
