import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Priya S.', location: 'Mumbai', rating: 5, text: 'Finally a healthy snack that doesn\'t taste like cardboard! The Peri-Peri Makhana is INSANELY good. My office is now addicted.', verified: true },
  { name: 'Rahul K.', location: 'Bangalore', rating: 5, text: 'Ordered 3 times in one month. The packaging is premium and delivery is super fast. Foxley is my go-to late-night snack now!', verified: true },
  { name: 'Ananya M.', location: 'Delhi', rating: 5, text: 'As a fitness enthusiast, finding Foxley was a game changer. High protein, low calorie — tastes amazing without the guilt.', verified: true },
  { name: 'Vikram T.', location: 'Pune', rating: 4, text: 'The combo pack is incredible value. Tried all 6 flavors — Classic Salt is my personal favorite. Will definitely order again!', verified: true },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-foxley-orange font-extrabold text-sm uppercase tracking-widest">Social Proof</span>
        <h2 className="text-4xl md:text-5xl font-black text-foxley-ink mt-1">
          The Foxley Family<br />
          <span className="text-foxley-green">Loves Us 💚</span>
        </h2>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
          </div>
          <span className="font-bold text-foxley-ink">4.9 out of 5 · 2,400+ reviews</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <Quote className="w-6 h-6 text-foxley-green/30 mb-3" />
            <p className="text-sm text-foxley-ink/80 leading-relaxed mb-4">"{t.text}"</p>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center font-bold text-foxley-green text-sm">
                {t.name[0]}
              </div>
              <div>
                <div className="font-bold text-sm text-foxley-ink">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.location}</div>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-3 h-3 ${s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                ))}
              </div>
            </div>
            {t.verified && (
              <div className="mt-3 text-[10px] font-semibold text-foxley-green flex items-center gap-1">
                ✓ Verified Purchase
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}