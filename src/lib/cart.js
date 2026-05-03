const CART_KEY = 'foxley_cart';
export const FREE_SHIPPING_THRESHOLD = 499;

function emitCartUpdated() { window.dispatchEvent(new Event('cartUpdated')); }

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}

function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); emitCartUpdated(); }

export function addToCart(product, quantity = 1, weight = null) {
  const cart = getCart();
  const key = `${product.id}-${weight || 'default'}`;
  const existing = cart.find((i) => i.key === key);
  if (existing) existing.quantity += quantity;
  else cart.push({ key, product_id: product.id, product_name: product.name, product_image: product.thumbnail, weight, quantity, price: product.price });
  saveCart(cart);
}
export function updateQuantity(key, quantity) {
  const cart = getCart().map((i) => i.key === key ? { ...i, quantity } : i).filter((i) => i.quantity > 0);
  saveCart(cart);
}
export function removeFromCart(key) { saveCart(getCart().filter((i) => i.key !== key)); }
export function clearCart() { saveCart([]); }
export function getCartCount(cart = getCart()) { return cart.reduce((a, c) => a + c.quantity, 0); }
export function getCartTotal(cart = getCart()) { return cart.reduce((a, c) => a + c.quantity * c.price, 0); }
