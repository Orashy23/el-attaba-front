/** Manual DTO mapping on the client. Keep this in lockstep with server/dtos.js. */

export function mapProductDto(dto) {
  if (!dto) return null
  return {
    id: dto.id,
    title: dto.title,
    price: dto.price,
    originalPrice: dto.originalPrice,
    rating: dto.rating,
    reviews: dto.reviews,
    category: dto.category,
    badge: dto.badge,
    image: dto.image,
    description: dto.description,
    sizes: dto.sizes ?? [],
    colors: dto.colors ?? [],
  }
}

export function mapOrderDto(dto) {
  if (!dto) return null
  return {
    id: dto.id,
    status: dto.status,
    total: dto.total,
    items: dto.items,
    createdAt: dto.createdAt,
    payment: dto.payment,
    compensation: dto.compensation,
    address: dto.address,
    name: dto.name,
  }
}
