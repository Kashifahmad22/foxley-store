export const products = [
  { id: 'p1', slug: 'peri-peri-makhana', name: 'Peri Peri Makhana', category: 'makhana', price: 199, compare_price: 249, rating: 4.6, is_featured: true, is_active: true, thumbnail: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800', short_description: 'Roasted foxnuts with fiery peri peri seasoning.' },
  { id: 'p2', slug: 'salted-almonds', name: 'Himalayan Salted Almonds', category: 'nuts', price: 299, rating: 4.7, is_featured: true, is_active: true, thumbnail: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800', short_description: 'Crunchy almonds tossed in pink Himalayan salt.' },
  { id: 'p3', slug: 'berry-trail-mix', name: 'Berry Trail Mix', category: 'trail-mix', price: 349, rating: 4.5, is_featured: false, is_active: true, thumbnail: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800', short_description: 'Nuts, seeds and dried berries for all-day energy.' },
  { id: 'p4', slug: 'snack-combo', name: 'Snack Combo Pack', category: 'combos', price: 599, rating: 4.8, is_featured: true, is_active: true, thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', short_description: 'Bestselling combo of premium snacks.' }
];

export function getAllProducts() { return products; }
export function getFeaturedProducts() { return products.filter((p) => p.is_featured && p.is_active); }
export function getProductBySlugOrId(value) {
  return products.find((p) => p.slug === value || p.id === value) || null;
}
