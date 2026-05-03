import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, ShoppingCart } from 'lucide-react';
import { addToCart } from '@/lib/cart';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product, 1);
    toast.success(`${product.name} added to bag! 🌿`, { duration: 2000 });
    setTimeout(() => setAdding(false), 800);
  };

  const glowColor = product.halo_color || (product.category === 'makhana' ? '#16A34A' : '#EA580C');

  return (
    <Link to={`/product/${product.slug || product.id}`} className="group block">
      <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-green-50 to-lime-50">
          {/* Halo glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(ellipse at center, ${glowColor}25, transparent 70%)` }} />

          {product.thumbnail ? (
            <img src={product.thumbnail} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🌿</div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_bestseller && (
              <span className="bg-foxley-orange text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide">
                Bestseller
              </span>
            )}
            {discount > 0 && (
              <span className="bg-foxley-green text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Quick add button */}
          <button
            onClick={handleQuickAdd}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${adding ? 'bg-foxley-green scale-110' : 'bg-white hover:bg-foxley-green hover:text-white'} opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0`}
          >
            {adding ? <ShoppingCart className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.flavor && (
            <span className="text-[11px] font-bold text-foxley-orange uppercase tracking-wider">{product.flavor}</span>
          )}
          <h3 className="font-extrabold text-foxley-ink text-sm mt-0.5 line-clamp-2 leading-snug">{product.name}</h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">({product.review_count || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-extrabold text-foxley-ink text-base">₹{product.price}</span>
            {product.compare_price && (
              <span className="text-xs text-muted-foreground line-through">₹{product.compare_price}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}