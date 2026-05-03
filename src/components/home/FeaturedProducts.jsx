import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProductCard from '@/components/products/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.filter({ is_active: true, is_featured: true }, '-sort_order', 8)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const skeletons = Array(4).fill(0);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-foxley-orange font-extrabold text-sm uppercase tracking-widest">The Collection</span>
          <h2 className="text-4xl md:text-5xl font-black text-foxley-ink mt-1 leading-tight">
            Featured<br />Flavors
          </h2>
        </div>
        <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-bold text-foxley-green hover:gap-2 transition-all">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? skeletons.map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))
          : products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        }
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link to="/shop" className="inline-flex items-center gap-2 bg-foxley-green text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-green-700 transition-colors">
          View All Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}