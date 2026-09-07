export const categories = [
  { id: 'all', label: 'All figures', slug: 'all' },
  { id: 'bestsellers', label: 'Top figures', slug: 'bestsellers' },
  { id: 'deals', label: 'On Sale', slug: 'deals' },
  { id: 'marvel', label: 'Marvel', slug: 'marvel' },
  { id: 'anime', label: 'Anime', slug: 'anime' },
  { id: 'movies', label: 'Movies & TV', slug: 'movies' },
  { id: 'sports', label: 'Sports', slug: 'sports' },
  { id: 'gaming', label: 'Gaming', slug: 'gaming' },
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
      'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&w=800&q=80',
    description:
      'Posable Iron Man collectible with metallic finish and stand. A desk-scale figure for Marvel shelves.',
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
      'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=80',
    description:
      'Shield-up pose with printed stars and stripes. A compact piece for mixed Marvel shelves.',
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
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    description:
      'Dynamic anime statue with sculpted cloak and base. For Naruto collectors who want a larger piece.',
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
      'https://images.unsplash.com/photo-1607604276583-e5829effed10?auto=format&fit=crop&w=800&q=80',
    description:
      'Battle-ready Saiyan sculpt with translucent energy effect. Comes with an extra pair of hands.',
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
      'https://images.unsplash.com/photo-1601814933824-fd0b574dd980?auto=format&fit=crop&w=800&q=80',
    description:
      'Chibi-style crew mini with stand. A bright shelf accent for One Piece fans.',
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
      'https://images.unsplash.com/photo-1618336753974-aae5e9278aee?auto=format&fit=crop&w=800&q=80',
    description:
      'Survey Corps figure with dual blades and 3D maneuver gear detailing.',
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
      'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&w=800&q=80',
    description:
      'Cape-flow Vader with lightsaber. Display-ready for Star Wars collections.',
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
      'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=800&q=80',
    description:
      'Character figure with painted suit detail and a themed display base.',
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
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    description:
      'Football star figure in the No.10 kit. Inspired by the sports figures you see at Pop Spot.',
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
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    description:
      'MINIX-style football mini. A compact collectible for national-team shelves.',
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
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
    description:
      'Egyptian-king pose with club kit printing. A local-favorite sports figure.',
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
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    description:
      'Armored Chief with assault rifle accessory. Built for gaming desks and LED shelves.',
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
      'https://images.unsplash.com/photo-1555448248-2571daf34cba?auto=format&fit=crop&w=800&q=80',
    description:
      'Stylized robot/hero figure for game-room displays. Matte armor with a small stand.',
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
