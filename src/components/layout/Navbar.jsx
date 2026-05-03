import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCart, getCartCount } from '@/lib/cart';

export default function Navbar() {
  const [count, setCount] = useState(getCartCount(getCart()));
  useEffect(() => {
    const sync = () => setCount(getCartCount(getCart()));
    window.addEventListener('cartUpdated', sync);
    return () => window.removeEventListener('cartUpdated', sync);
  }, []);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-black text-xl">Foxley</Link>
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart ({count})</Link>
        </nav>
      </div>
    </header>
  );
}
