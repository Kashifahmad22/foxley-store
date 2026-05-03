import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TrustBar from '@/components/home/TrustBar';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-foxley-bone">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <TrustBar />

      {/* Marquee banner */}
      <div className="bg-foxley-orange overflow-hidden py-3">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {Array(6).fill(['🌿 GUILT-FREE', '⚡ HIGH PROTEIN', '🔥 BOLD FLAVORS', '✨ ZERO PRESERVATIVES', '🚚 FAST DELIVERY', '❤️ LOVED BY THOUSANDS']).flat().map((text, i) => (
            <span key={i} className="text-white font-extrabold text-sm tracking-widest uppercase">{text}</span>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-foxley-green rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-white/70" />
              <span className="text-white/70 text-sm font-semibold uppercase tracking-wider">Bundle & Save</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Try All 6 Flavors.<br />Save 25%.
            </h2>
            <p className="text-white/80 mt-3 text-lg">
              The Foxley Variety Pack — one of each flavor. Perfect for discovering your new favorite.
            </p>
          </div>
          <Link to="/shop?category=combos"
            className="relative z-10 shrink-0 bg-white text-foxley-green px-10 py-5 rounded-full font-extrabold text-sm hover:bg-foxley-bone transition-all hover:scale-105 flex items-center gap-2 shadow-xl">
            Shop Bundles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <TestimonialsSection />
    </div>
  );
}