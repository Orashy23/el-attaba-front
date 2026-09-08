export const categories = [
  { id: 'all', label: 'All figures', slug: 'all' },
  { id: 'bestsellers', label: 'Top figures', slug: 'bestsellers' },
  { id: 'deals', label: 'On Sale', slug: 'deals' },
  { id: 'marvel', label: 'Marvel', slug: 'marvel', swatch: '#c23b2e' },
  { id: 'anime', label: 'Anime', slug: 'anime', swatch: '#e0913a' },
  { id: 'movies', label: 'Movies & TV', slug: 'movies', swatch: '#3d4a63' },
  { id: 'sports', label: 'Sports', slug: 'sports', swatch: '#3f8a5c' },
  { id: 'gaming', label: 'Gaming', slug: 'gaming', swatch: '#2c46d6' },
]

export const collectionLinks = categories.filter(
  (item) => !['all', 'deals', 'bestsellers'].includes(item.id),
)

export const products = [
  {
    id: 'p1',
    title: 'Marvel — Iron Man Mark 85 Figure (18 cm)',
    price: 1299,
    originalPrice: 1699,
    rating: 4.8,
    reviews: 642,
    category: 'marvel',
    badge: 'Deal',
    image:
      'https://images.unsplash.com/photo-1614049026175-d2acb96c6a81?auto=format&fit=crop&w=800&q=80',
    description:
      'Posable Iron Man collectible with metallic finish and stand. A desk-scale figure for Marvel shelves.',
    sizes: ['12 cm', '18 cm', '25 cm'],
    colors: [
      { name: 'Red & Gold', hex: '#c0392b' },
      { name: 'Stealth Black', hex: '#1c1c1c' },
    ],
  },
  {
    id: 'p2',
    title: 'Marvel — Spider-Man Classic Suit (16 cm)',
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 891,
    category: 'marvel',
    badge: 'Best seller',
    image:
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    description:
      'Classic red-and-blue Spider-Man figure with web-line base. Packed in a collector window box.',
    sizes: ['12 cm', '16 cm', '20 cm'],
    colors: [
      { name: 'Classic Red & Blue', hex: '#c0392b' },
      { name: 'Black Suit', hex: '#111111' },
    ],
  },
  {
    id: 'p3',
    title: 'Marvel — Avengers Lineup Set (5 pack)',
    price: 2499,
    originalPrice: 2999,
    rating: 4.6,
    reviews: 318,
    category: 'marvel',
    badge: 'Deal',
    image:
      'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?auto=format&fit=crop&w=800&q=80',
    description:
      'Five-figure Avengers set for display. Includes character cards and a shared stand.',
    sizes: ['Standard (5 × 9 cm)', 'Deluxe (5 × 12 cm)'],
  },
  {
    id: 'p4',
    title: 'Marvel — Captain America Shield Pose (15 cm)',
    price: 749,
    originalPrice: 949,
    rating: 4.5,
    reviews: 412,
    category: 'marvel',
    image:
      'https://images.unsplash.com/photo-1638379036667-ee3e8d663f2d?auto=format&fit=crop&w=800&q=80',
    description:
      'Shield-up pose with printed stars and stripes. A compact piece for mixed Marvel shelves.',
    sizes: ['10 cm', '15 cm', '20 cm'],
    colors: [
      { name: 'Stars & Stripes', hex: '#2c5aa0' },
      { name: 'Stealth Uniform', hex: '#2f3640' },
    ],
  },
  {
    id: 'p5',
    title: 'Anime — Naruto Sage Mode Figure (20 cm)',
    price: 1599,
    originalPrice: 1899,
    rating: 4.8,
    reviews: 1024,
    category: 'anime',
    badge: 'Deal',
    image:
      'https://images.unsplash.com/photo-1750136370972-27df2d1a7c99?auto=format&fit=crop&w=800&q=80',
    description:
      'Dynamic anime statue with sculpted cloak and base. For Naruto collectors who want a larger piece.',
    sizes: ['15 cm', '20 cm', '28 cm'],
    colors: [
      { name: 'Sage Mode', hex: '#e58e26' },
      { name: 'Nine-Tails Cloak', hex: '#e74c3c' },
    ],
  },
  {
    id: 'p6',
    title: 'Anime — Dragon Ball Super Saiyan Figure',
    price: 1399,
    originalPrice: 1699,
    rating: 4.7,
    reviews: 776,
    category: 'anime',
    image:
      'https://images.unsplash.com/photo-1783765803367-9c57f64709ee?auto=format&fit=crop&w=800&q=80',
    description:
      'Battle-ready Saiyan sculpt with translucent energy effect. Comes with an extra pair of hands.',
    sizes: ['12 cm', '18 cm', '24 cm'],
    colors: [
      { name: 'Super Saiyan', hex: '#f1c40f' },
      { name: 'Base Form', hex: '#2c3e50' },
    ],
  },
  {
    id: 'p7',
    title: 'Anime — One Piece Straw Hat Crew Mini',
    price: 999,
    originalPrice: 1299,
    rating: 4.4,
    reviews: 540,
    category: 'anime',
    badge: 'Deal',
    image:
      'https://images.unsplash.com/photo-1766062996151-e247dc21c1cf?auto=format&fit=crop&w=800&q=80',
    description:
      'Sculpted Luffy mini in his signature straw hat. A bright shelf accent for One Piece fans.',
    sizes: ['Mini (6 cm)', 'Standard (10 cm)'],
  },
  {
    id: 'p8',
    title: 'Anime — Attack on Titan Scout Figure',
    price: 1199,
    originalPrice: 1499,
    rating: 4.6,
    reviews: 388,
    category: 'anime',
    image:
      'https://images.unsplash.com/photo-1783937225803-1fad4eb202f5?auto=format&fit=crop&w=800&q=80',
    description:
      'Survey Corps figure with dual blades and 3D maneuver gear detailing.',
    sizes: ['14 cm', '18 cm'],
    colors: [
      { name: 'Scout Regiment Green', hex: '#2e7d32' },
      { name: 'Night Ops Grey', hex: '#616161' },
    ],
  },
  {
    id: 'p9',
    title: 'Movies — Batman The Dark Knight (18 cm)',
    price: 1099,
    originalPrice: 1399,
    rating: 4.7,
    reviews: 701,
    category: 'movies',
    badge: 'Deal',
    image:
      'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=800&q=80',
    description:
      'Cowl-and-cape Batman with a matte black finish. A staple DC movie collectible.',
    sizes: ['12 cm', '18 cm', '24 cm'],
    colors: [
      { name: 'Matte Black', hex: '#111111' },
      { name: 'Tactical Grey', hex: '#4a4a4a' },
    ],
  },
  {
    id: 'p10',
    title: 'Movies — Star Wars Darth Vader (22 cm)',
    price: 1899,
    originalPrice: 2299,
    rating: 4.9,
    reviews: 956,
    category: 'movies',
    badge: 'Best seller',
    image:
      'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=800&q=80',
    description:
      'Cape-flow Vader flanked by Stormtrooper escorts. Display-ready for Star Wars collections.',
    sizes: ['16 cm', '22 cm', '30 cm'],
    colors: [{ name: 'Classic Black', hex: '#0d0d0d' }],
  },
  {
    id: 'p11',
    title: 'Movies — Joker Street Pose Figure',
    price: 1299,
    originalPrice: 1599,
    rating: 4.5,
    reviews: 290,
    category: 'movies',
    image:
      'https://images.unsplash.com/photo-1748960644758-f090ba96d1da?auto=format&fit=crop&w=800&q=80',
    description:
      'Character figure with painted suit detail and a themed display base.',
    sizes: ['14 cm', '18 cm'],
    colors: [
      { name: 'Purple Coat', hex: '#6c3483' },
      { name: 'Green Vest', hex: '#1e8449' },
    ],
  },
  {
    id: 'p12',
    title: 'Sports — Leo Messi No.10 Action Figure (20 cm)',
    price: 950,
    originalPrice: 1250,
    rating: 4.8,
    reviews: 1340,
    category: 'sports',
    badge: 'Deal',
    image:
      'https://images.unsplash.com/photo-1744124338043-ab0a848cf26b?auto=format&fit=crop&w=800&q=80',
    description:
      'Football star figure in the No.10 kit. Inspired by the sports figures you see at Pop Spot.',
    sizes: ['16 cm', '20 cm'],
    colors: [
      { name: 'Home Kit', hex: '#7fb3d5' },
      { name: 'Away Kit', hex: '#1c2833' },
    ],
  },
  {
    id: 'p13',
    title: 'Sports — Kylian Mbappé France Mini (12 cm)',
    price: 750,
    originalPrice: 890,
    rating: 4.6,
    reviews: 812,
    category: 'sports',
    image:
      'https://images.unsplash.com/photo-1782252152308-75c2e412f8d8?auto=format&fit=crop&w=800&q=80',
    description:
      'MINIX-style football mini. A compact collectible for national-team shelves.',
    sizes: ['12 cm'],
    colors: [
      { name: 'Home Kit', hex: '#1c2833' },
      { name: 'Away Kit', hex: '#f5f5f5' },
    ],
  },
  {
    id: 'p14',
    title: 'Sports — Mohamed Salah Liverpool Figure',
    price: 850,
    originalPrice: 1100,
    rating: 4.7,
    reviews: 640,
    category: 'sports',
    badge: 'Deal',
    image:
      'https://images.unsplash.com/photo-1617607626732-eb48d7d766a9?auto=format&fit=crop&w=800&q=80',
    description:
      'Egyptian-king pose with club kit printing. A local-favorite sports figure.',
    sizes: ['14 cm', '18 cm'],
    colors: [
      { name: 'Home Red', hex: '#c8102e' },
      { name: 'Third Kit', hex: '#f2f2f2' },
    ],
  },
  {
    id: 'p15',
    title: 'Gaming — Master Chief Halo Figure (18 cm)',
    price: 1499,
    originalPrice: 1799,
    rating: 4.6,
    reviews: 455,
    category: 'gaming',
    image:
      'https://images.unsplash.com/photo-1552875101-979d61f26eb0?auto=format&fit=crop&w=800&q=80',
    description:
      'Armored Chief with assault rifle accessory. Built for gaming desks and LED shelves.',
    sizes: ['14 cm', '18 cm', '24 cm'],
    colors: [
      { name: 'Mjolnir Green', hex: '#1b4d3e' },
      { name: 'Onyx', hex: '#141414' },
    ],
  },
  {
    id: 'p16',
    title: 'Gaming — Retro Controller Hero Figure',
    price: 649,
    originalPrice: 849,
    rating: 4.3,
    reviews: 210,
    category: 'gaming',
    badge: 'Deal',
    image:
      'https://images.unsplash.com/photo-1781094732361-70f19ff999b0?auto=format&fit=crop&w=800&q=80',
    description:
      'Retro gaming icon trio for game-room shelves. Bright, glossy sculpts sized for display.',
    sizes: ['Standard (10 cm)'],
    colors: [
      { name: 'Mario Red', hex: '#e52521' },
      { name: 'Luigi Green', hex: '#43b047' },
    ],
  },
]

export function formatPrice(amount) {
  return `EGP ${amount.toLocaleString('en-EG')}`
}

export function getProductById(id) {
  return products.find((product) => product.id === id)
}

export function getBestsellers() {
  return products
    .filter((product) => product.badge === 'Best seller' || product.reviews >= 800)
    .sort((a, b) => b.reviews - a.reviews)
}

export function getProductsByCategory(slug) {
  if (!slug || slug === 'all') return products
  if (slug === 'deals') return products.filter((product) => product.badge === 'Deal')
  if (slug === 'bestsellers') return getBestsellers()
  return products.filter((product) => product.category === slug)
}

export function searchProducts(query, category = 'all') {
  const pool = getProductsByCategory(category)
  const term = query.trim().toLowerCase()
  if (!term) return pool
  return pool.filter(
    (product) =>
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term),
  )
}

export function getHomeRows() {
  return [
    { title: 'Marvel', href: '/category/marvel', items: getProductsByCategory('marvel') },
    { title: 'Anime', href: '/category/anime', items: getProductsByCategory('anime') },
    { title: 'Movies & TV', href: '/category/movies', items: getProductsByCategory('movies') },
    { title: 'Sports', href: '/category/sports', items: getProductsByCategory('sports') },
    { title: 'Gaming', href: '/category/gaming', items: getProductsByCategory('gaming') },
  ]
}
