import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { label: 'Makhana', slug: 'makhana', emoji: '🌿', color: 'from-green-100 to-emerald-200', text: 'text-green-800', desc: 'The OG guilt-free crunch' },
  { label: 'Nuts & Seeds', slug: 'nuts', emoji: '🥜', color: 'from-amber-100 to-yellow-200', text: 'text-amber-800', desc: 'Power-packed and delicious' },
  { label: 'Trail Mix', slug: 'trail-mix', emoji: '🏔️', color: 'from-orange-100 to-amber-200', text: 'text-orange-800', desc: 'Adventure in every handful' },
  { label: 'Combos', slug: 'combos', emoji: '🎯', color: 'from-pink-100 to-rose-200', text: 'text-rose-800', desc: 'Mix. Match. Save.' },
  { label: 'Gift Boxes', slug: 'gift-boxes', emoji: '🎁', color: 'from-purple-100 to-violet-200', text: 'text-purple-800', desc: 'Perfect for every occasion' },
  { label: 'Bestsellers', slug: null, filter: 'bestseller', emoji: '⭐', color: 'from-yellow-100 to-amber-200', text: 'text-yellow-800', desc: 'Community favorites' },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <span className="text-foxley-orange font-extrabold text-sm uppercase tracking-widest">Browse By</span>
        <h2 className="text-4xl md:text-5xl font-black text-foxley-ink mt-1">Shop Categories</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => {
          const href = cat.filter
            ? `/shop?filter=${cat.filter}`
            : `/shop?category=${cat.slug}`;
          return (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="h-full"
            >
              <Link to={href}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br ${cat.color} hover:scale-105 transition-all duration-200 group shadow-sm hover:shadow-md h-full min-h-[120px]`}>
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
                <span className={`font-extrabold text-sm ${cat.text} text-center leading-tight`}>{cat.label}</span>
                <span className="text-xs text-center mt-1 text-foxley-ink/50 hidden sm:block">{cat.desc}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}