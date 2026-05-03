import { motion } from 'framer-motion';

const features = [
  { icon: '🌿', title: '100% Natural', desc: 'No artificial flavors or preservatives' },
  { icon: '⚡', title: 'High Protein', desc: 'Protein-packed snacks that fuel you' },
  { icon: '❤️', title: 'Heart Healthy', desc: 'Low fat, low calorie, big taste' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Delivered in 2-5 business days' },
  { icon: '🔄', title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay encrypted checkout' },
];

export default function TrustBar() {
  return (
    <section className="py-16 bg-foxley-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-extrabold text-white text-sm">{f.title}</div>
              <div className="text-xs text-white/50 mt-1 leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}