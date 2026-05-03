import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { addToCart } from '@/lib/cart';
import { toast } from 'sonner';
import { Star, ShoppingBag, Truck, Shield, RotateCcw, Plus, Minus, ChevronRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    // Try by slug first, then by id
    base44.entities.Product.filter({ slug }, '-created_date', 1)
      .then(results => {
        if (results.length > 0) {
          setProduct(results[0]);
          if (results[0].weight_options?.length > 0) setSelectedWeight(results[0].weight_options[0].weight);
        } else {
          return base44.entities.Product.filter({ id: slug }, '-created_date', 1).then(r => {
            if (r.length > 0) {
              setProduct(r[0]);
              if (r[0].weight_options?.length > 0) setSelectedWeight(r[0].weight_options[0].weight);
            }
          });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-square bg-muted rounded-3xl" />
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-foxley-ink">Product not found</h2>
        <Link to="/shop" className="mt-4 inline-block bg-foxley-green text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-700 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail].filter(Boolean);
  const currentPrice = selectedWeight
    ? (product.weight_options?.find(w => w.weight === selectedWeight)?.price || product.price)
    : product.price;
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;
  const nutrition = product.nutritional_info || {};
  const tabs = [
    { id: 'story', label: 'The Story' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'ingredients', label: 'Ingredients' },
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedWeight);
    toast.success(`${product.name} added to bag! 🌿`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foxley-green transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-foxley-green transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foxley-ink font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-lime-50">
            {product.halo_color && (
              <div className="absolute inset-0 opacity-30"
                style={{ background: `radial-gradient(ellipse at center, ${product.halo_color}40, transparent 70%)` }} />
            )}
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product.name}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🌿</div>
            )}
            {product.is_bestseller && (
              <div className="absolute top-4 left-4 bg-foxley-orange text-white text-xs font-extrabold px-3 py-1.5 rounded-full">
                ⭐ BESTSELLER
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-foxley-green' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          {product.flavor && (
            <span className="text-foxley-orange font-extrabold text-sm uppercase tracking-wider">{product.flavor}</span>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-foxley-ink leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
              ))}
            </div>
            <span className="text-sm font-semibold">{product.rating || 0}</span>
            <span className="text-sm text-muted-foreground">({product.review_count || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-foxley-ink">₹{currentPrice}</span>
            {product.compare_price && (
              <>
                <span className="text-xl text-muted-foreground line-through">₹{product.compare_price}</span>
                <span className="bg-foxley-green text-white text-sm font-extrabold px-3 py-1 rounded-full">{discount}% OFF</span>
              </>
            )}
          </div>

          {product.short_description && (
            <p className="text-foxley-ink/70 leading-relaxed">{product.short_description}</p>
          )}

          {/* Weight options */}
          {product.weight_options?.length > 0 && (
            <div>
              <p className="text-sm font-bold text-foxley-ink mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.weight_options.map(opt => (
                  <button key={opt.weight} onClick={() => setSelectedWeight(opt.weight)}
                    className={`px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${selectedWeight === opt.weight ? 'border-foxley-green bg-green-50 text-foxley-green' : 'border-border hover:border-foxley-green'}`}>
                    {opt.weight}
                    {opt.price && <span className="block text-xs font-semibold mt-0.5 text-muted-foreground">₹{opt.price}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white border border-border rounded-full px-4 py-2.5">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 hover:text-foxley-orange transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold w-8 text-center text-foxley-ink">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}
                className="p-1 hover:text-foxley-green transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button onClick={handleAddToCart}
              className="flex-1 bg-foxley-green text-white py-4 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-all hover:scale-105 shadow-lg shadow-green-500/20">
              <ShoppingBag className="w-4 h-4" /> Add to Bag
            </button>

            <button className="p-4 border-2 border-border rounded-full hover:border-foxley-orange hover:text-foxley-orange transition-all">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Bundle nudge */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-bold text-sm text-foxley-green">Buy the Variety Bundle & Save 25%</p>
              <p className="text-xs text-foxley-ink/60 mt-0.5">Mix 6 flavors. One pack. Best value.</p>
            </div>
            <Link to="/shop?category=combos" className="ml-auto shrink-0 bg-foxley-green text-white px-4 py-2 rounded-full text-xs font-extrabold hover:bg-green-700 transition-colors">
              Shop Bundle
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On orders ₹499+' },
              { icon: Shield, label: 'Secure Pay', sub: 'Razorpay encrypted' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '7-day policy' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-border">
                <Icon className="w-5 h-5 text-foxley-green mb-1" />
                <span className="text-xs font-bold text-foxley-ink">{label}</span>
                <span className="text-[10px] text-muted-foreground">{sub}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 border-b border-border">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 text-sm font-bold transition-all ${activeTab === tab.id ? 'border-b-2 border-foxley-green text-foxley-green' : 'text-muted-foreground hover:text-foxley-ink'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="pt-5">
              {activeTab === 'story' && (
                <p className="text-foxley-ink/70 leading-relaxed text-sm">
                  {product.description || 'Every Foxley snack is crafted with care — premium ingredients, bold flavors, and zero compromise. Roasted to perfection, guilt-free by design.'}
                </p>
              )}
              {activeTab === 'nutrition' && (
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'Calories', val: nutrition.calories || '-', unit: 'kcal', color: 'bg-amber-50 text-amber-700' },
                    { label: 'Protein', val: nutrition.protein || '-', unit: 'g', color: 'bg-blue-50 text-blue-700' },
                    { label: 'Carbs', val: nutrition.carbs || '-', unit: 'g', color: 'bg-orange-50 text-orange-700' },
                    { label: 'Fat', val: nutrition.fat || '-', unit: 'g', color: 'bg-yellow-50 text-yellow-700' },
                    { label: 'Fiber', val: nutrition.fiber || '-', unit: 'g', color: 'bg-green-50 text-green-700' },
                  ].map(item => (
                    <div key={item.label} className={`${item.color} rounded-2xl p-3 text-center`}>
                      <div className="text-2xl font-black">{item.val}</div>
                      <div className="text-[10px] font-semibold uppercase">{item.unit}</div>
                      <div className="text-xs mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'ingredients' && (
                <div className="space-y-3">
                  <p className="text-sm text-foxley-ink/70">{product.ingredients || 'Natural ingredients, spices, and seasoning. Free from artificial preservatives.'}</p>
                  {product.allergens && <p className="text-xs font-semibold text-foxley-orange">⚠️ Allergens: {product.allergens}</p>}
                  {product.shelf_life && <p className="text-xs text-muted-foreground">📅 Shelf Life: {product.shelf_life}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}