import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/lib/products';

export default function Home() {
  const featured = getFeaturedProducts();
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black mb-6">Healthy Snacking, Made Better</h1>
      <Link to="/shop" className="inline-block bg-foxley-green text-white px-5 py-2 rounded-full font-bold">Shop now</Link>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        {featured.map((p) => <div key={p.id} className="bg-white rounded-xl p-4"><p className="font-bold">{p.name}</p><p>₹{p.price}</p></div>)}
      </div>
    </div>
  );
}
