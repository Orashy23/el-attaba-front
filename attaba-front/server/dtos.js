/** Manual mapping only — no AutoMapper/Mapster. See docs/DECISIONS.md. */

export function toProductDto(product) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating,
    reviews: product.reviews,
    category: product.category,
    badge: product.badge,
    image: product.image,
    description: product.description,
  }
}

export function toOrderItemDto(item) {
  return {
    productId: item.productId,
    title: item.title,
    qty: item.qty,
    unitPriceSnapshot: item.unitPriceSnapshot,
    lineTotal: item.unitPriceSnapshot * item.qty,
  }
}

export function toOrderDto(order) {
  return {
    id: order.id,
    status: order.status,
    customerId: order.customerId,
    items: order.items.map(toOrderItemDto),
    total: order.total,
    address: order.address,
    phone: order.phone,
    name: order.name,
    payment: {
      provider: order.payment.provider,
      status: order.payment.status,
      id: order.payment.id,
    },
    compensation: order.compensation ?? null,
    createdAt: order.createdAt,
  }
}

export function toUserDto(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }
}

export function sendError(res, status, code, message, details = []) {
  res.status(status).json({
    error: { code, message, details },
  })
}

export function sendOk(res, data, meta) {
  res.json(meta ? { data, meta } : { data })
}
