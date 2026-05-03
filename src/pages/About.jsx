import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Zap, Shield, ArrowRight } from 'lucide-react';

const values = [
  { icon: Leaf, title: '100% Natural', desc: 'No artificial flavors, colors, or preservatives. What you see on the label is what you get — nothing more, nothing less.', color: 'bg-green-50 text-foxley-green' },
  { icon: Zap, title: 'High Protein', desc: 'Makhana is naturally packed with protein and low in calories — the perfect fuel for active lifestyles without the guilt.', color: 'bg-orange-50 text-foxley-orange' },
  { icon: Heart, title: 'Made with Love', desc: 'Every batch is crafted with care, ensuring consistent quality and bold flavor in every single bite.', color: 'bg-pink-50 text-pink-600' },
  { icon: Shield, title: 'Quality Assured', desc: 'Rigorous quality checks at every step — from sourcing to packaging — so you always get the freshest snacks.', color: 'bg-blue-50 text-blue-600' },
];

const team = [
  { name: 'Aryan Mehta', role: 'Founder & CEO', emoji: '👨‍💼', desc: 'Passionate about healthy living and building brands that make a difference.' },
  { name: 'Priya Sharma', role: 'Head of Product', emoji: '👩‍🍳', desc: 'Former chef turned snack innovator — she\'s the brain behind our bold flavors.' },
  { name: 'Rohit Gupta', role: 'Operations Lead', emoji: '📦', desc: 'Ensures every order reaches you fresh, fast, and perfectly packed.' },
];

export default function About() {
  return (
    <div className="bg-foxley-bone">
      {/* Hero */}
      <section className="relative bg-foxley-ink overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-foxley-green rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-foxley-orange rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-foxley-green/20 text-foxley-green font-extrabold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Snacking Should<br />
              <span className="text-foxley-green">Never Be Boring.</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Foxley was born from a simple idea — that healthy snacking shouldn't mean sacrificing flavor. We set out to reinvent the snack aisle with bold, guilt-free options that actually taste incredible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-foxley-orange font-extrabold text-sm uppercase tracking-widest">How It Started</span>
            <h2 className="text-4xl md:text-5xl font-black text-foxley-ink mt-2 mb-6 leading-tight">
              From a Kitchen<br />Experiment to<br />Your Doorstep
            </h2>
            <div className="space-y-4 text-foxley-ink/70 leading-relaxed">
              <p>
                It started with a late-night snack crisis. Our founder, tired of choosing between junk food and bland "healthy" options, stumbled upon Makhana — an ancient Indian superfood that had been hiding in plain sight for centuries.
              </p>
              <p>
                After months of experimenting with flavors in a tiny kitchen, Foxley was born. We took traditional fox nuts and gave them a bold, modern twist — Peri-Peri, Himalayan Salt, Tandoori Masala, and more.
              </p>
              <p>
                Today, thousands of happy snackers across India choose Foxley every day. Not because they have to eat healthy — but because Foxley actually tastes too good to resist.
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-square">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80"
                alt="Foxley Kitchen" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl">
              <div className="text-3xl font-black text-foxley-green">2,400+</div>
              <div className="text-sm text-foxley-ink font-semibold">Happy Snackers</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-foxley-orange text-white rounded-2xl p-5 shadow-xl">
              <div className="text-3xl font-black">4.9★</div>
              <div className="text-sm font-semibold">Avg Rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-foxley-orange font-extrabold text-sm uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-4xl md:text-5xl font-black text-foxley-ink mt-2">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-foxley-bone rounded-2xl p-6">
                  <div className={`w-12 h-12 rounded-xl ${v.color} bg-opacity-20 flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-foxley-ink text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-foxley-ink/60 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-foxley-orange font-extrabold text-sm uppercase tracking-widest">The People</span>
          <h2 className="text-4xl md:text-5xl font-black text-foxley-ink mt-2">Meet the Team</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {team.map((member, i) => (
            <motion.div key={member.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-5xl mb-4">{member.emoji}</div>
              <h3 className="font-extrabold text-foxley-ink">{member.name}</h3>
              <div className="text-xs font-bold text-foxley-green uppercase tracking-wider mt-1 mb-3">{member.role}</div>
              <p className="text-sm text-foxley-ink/60 leading-relaxed">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <div className="bg-foxley-green rounded-3xl p-10 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Snack Smarter?</h2>
          <p className="text-white/80 mb-8 text-lg">Join thousands of Foxley fans and discover your new favorite guilt-free snack.</p>
          <Link to="/shop"
            className="inline-flex items-center gap-2 bg-white text-foxley-green px-8 py-4 rounded-full font-extrabold text-sm hover:bg-foxley-bone transition-all hover:scale-105 shadow-lg">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}