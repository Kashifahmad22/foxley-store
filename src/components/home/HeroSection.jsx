import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';

const slides = [
  {
    headline: 'NO GUILT.',
    subheadline: 'ALL CRUNCH.',
    tag: 'TOTAL FOXLEY.',
    desc: 'Roasted Makhana in bold flavors. 100% natural. Zero compromise on taste.',
    badge: 'SHOP THE POP',
    bg: 'from-green-50 to-emerald-100',
    accent: '#16A34A',
    image: 'https://images.unsplash.com/photo-1571119865893-e40a5e6ceae8?w=700&q=80',
    emoji: '🌿',
  },
  {
    headline: 'SNACK',
    subheadline: 'SMARTER.',
    tag: 'LIVE BOLDER.',
    desc: 'High protein. Low calorie. Maximum flavor. Makhana like never before.',
    badge: 'EXPLORE FLAVORS',
    bg: 'from-orange-50 to-amber-100',
    accent: '#EA580C',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=80',
    emoji: '🔥',
  },
  {
    headline: 'GUILT-FREE',
    subheadline: 'INDULGENCE.',
    tag: "THAT'S FOXLEY.",
    desc: 'From Peri-Peri to Himalayan Salt — find your favorite in every bag.',
    badge: 'SHOP BUNDLES',
    bg: 'from-lime-50 to-green-100',
    accent: '#16A34A',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=700&q=80',
    emoji: '✨',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${slide.bg} transition-all duration-700 min-h-[90vh] flex items-center`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-foxley-green blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-foxley-orange blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
              className="space-y-6">

              {/* Rating badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-foxley-ink">4.9 · 2,400+ happy snackers</span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foxley-ink leading-none">
                  {slide.headline}<br />
                  <span style={{ color: slide.accent }}>{slide.subheadline}</span><br />
                  <span className="text-4xl md:text-5xl">{slide.tag}</span>
                </h1>
              </div>

              <p className="text-lg text-foxley-ink/70 max-w-md">{slide.desc}</p>

              <div className="flex flex-wrap gap-4">
                <Link to="/shop"
                  className="inline-flex items-center gap-2 bg-foxley-green text-white px-8 py-4 rounded-full font-extrabold text-sm hover:bg-green-700 transition-all hover:scale-105 shadow-lg shadow-green-500/30">
                  {slide.badge} <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/shop?filter=bestseller"
                  className="inline-flex items-center gap-2 border-2 border-foxley-ink text-foxley-ink px-8 py-4 rounded-full font-extrabold text-sm hover:bg-foxley-ink hover:text-white transition-all">
                  Bestsellers
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                {['🌿 100% Natural', '⚡ High Protein', '🚫 No Preservatives', '📦 Free Shipping ₹499+'].map(badge => (
                  <span key={badge} className="text-xs font-semibold text-foxley-ink/60 bg-white/70 px-3 py-1.5 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Image side */}
          <AnimatePresence mode="wait">
            <motion.div key={`img-${current}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative flex justify-center">

              <div className="relative w-full max-w-md aspect-square">
                {/* Halo glow */}
                <div className="absolute inset-0 rounded-full blur-3xl opacity-40"
                  style={{ background: `radial-gradient(ellipse, ${slide.accent}60, transparent)` }} />

                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                  <img src={slide.image} alt="Foxley Snacks"
                    className="w-full h-full object-cover" />
                  {/* Overlay badge */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                    <div className="text-2xl">{slide.emoji}</div>
                    <div className="font-extrabold text-xs text-foxley-ink mt-0.5">Guilt-Free</div>
                    <div className="text-[10px] text-muted-foreground">Snacking</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-foxley-green' : 'w-2 h-2 bg-foxley-ink/20'}`} />
        ))}
      </div>
    </section>
  );
}