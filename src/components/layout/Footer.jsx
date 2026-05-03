import { Link } from 'react-router-dom';
import { Leaf, Instagram, Twitter, Facebook, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foxley-ink text-white mt-24">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-foxley-green rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-extrabold text-lg tracking-tight">FOXLEY</div>
                <div className="text-[10px] text-foxley-orange font-semibold uppercase tracking-widest">by Mkahana</div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              No guilt. All crunch. We make snacking something to celebrate — bold flavors, clean ingredients, zero compromise.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-foxley-green transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-foxley-orange">Shop</h4>
            <ul className="space-y-2">
              {['All Products', 'Makhana', 'Nuts & Seeds', 'Trail Mix', 'Combos', 'Gift Boxes'].map(item => (
                <li key={item}>
                  <Link to="/shop" className="text-sm text-white/60 hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-foxley-orange">Help</h4>
            <ul className="space-y-2">
              {[
                { label: 'Track Order', to: '/track' },
                { label: 'Returns & Refunds', to: '/returns' },
                { label: 'FAQ', to: '/faq' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Shipping Policy', to: '/shipping-policy' },
                { label: 'Privacy Policy', to: '/privacy-policy' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-white/60 hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-foxley-orange">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:hello@foxley.in" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail className="w-4 h-4 shrink-0" /> hello@foxley.in
              </a>
              <a href="tel:+919999999999" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone className="w-4 h-4 shrink-0" /> +91 99999 99999
              </a>
            </div>
            <div className="mt-6">
              <p className="text-xs text-white/40 mb-2">Subscribe for exclusive deals</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-foxley-green text-white placeholder:text-white/30" />
                <button className="bg-foxley-green px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <span>© 2024 Foxley by Mkahana. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}