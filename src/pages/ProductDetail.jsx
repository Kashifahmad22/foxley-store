import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { addToCart } from '@/lib/cart';
import { getProductBySlugOrId } from '@/lib/products';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductBySlugOrId(id);
  if (!product) return <div className="p-8">Product not found. <Link to="/shop" className="underline">Back to shop</Link></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <img src={product.thumbnail} alt={product.name} className="rounded-2xl w-full" />
      <div>
        <h1 className="text-3xl font-black">{product.name}</h1>
        <p className="mt-3 text-gray-600">{product.short_description}</p>
        <p className="text-2xl font-bold mt-4">₹{product.price}</p>
        <button onClick={() => addToCart(product, 1)} className="mt-6 bg-foxley-green text-white px-6 py-3 rounded-full font-bold">Add to cart</button>
      </div>
    </motion.div>
  );
}
