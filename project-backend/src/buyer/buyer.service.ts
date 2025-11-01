import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from './entities/cart.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { BuyerProfile } from './entities/buyer-profile.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { BuyerProfileDto } from './dto/profile.dto';

@Injectable()
export class BuyerService {
  // Mock in-memory stores
  private carts = new Map<string, Cart>();      // key: buyerId
  private orders = new Map<string, Order[]>();  // key: buyerId
  private profiles = new Map<string, BuyerProfile>();

  private ok(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

  // --- Cart operations ---
  addToCart(buyerId: string, dto: AddToCartDto) {
    const cart = this.carts.get(buyerId) ?? { buyerId, items: [], updatedAt: new Date() };
    const existing = cart.items.find(i => i.productId === dto.productId);
    if (existing) {
      existing.quantity += dto.quantity;
      existing.price = dto.price; // keep latest price
    } else {
      const item: CartItem = { ...dto };
      cart.items.push(item);
    }
    cart.updatedAt = new Date();
    this.carts.set(buyerId, cart);
    return this.ok(cart, { message: 'Item added to cart' });
  }

  updateCartItem(buyerId: string, productId: string, dto: UpdateCartItemDto) {
    const cart = this.carts.get(buyerId);
    if (!cart) return this.ok(null, { message: 'Cart not found' });
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return this.ok(null, { message: 'Item not found' });
    item.quantity = dto.quantity;
    cart.updatedAt = new Date();
    return this.ok(cart, { message: 'Cart item updated' });
  }

  removeCartItem(buyerId: string, productId: string) {
    const cart = this.carts.get(buyerId);
    if (!cart) return this.ok(null, { message: 'Cart not found' });
    const before = cart.items.length;
    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.updatedAt = new Date();
    return this.ok({ removed: before - cart.items.length, cart }, { message: 'Cart item removed' });
  }

  getCart(buyerId: string, coupon?: string) {
    const cart = this.carts.get(buyerId) ?? { buyerId, items: [], updatedAt: new Date() };
    if (coupon) cart.coupon = coupon;
    return this.ok(cart);
  }

  // --- Orders ---
  createOrder(dto: CreateOrderDto) {
    const total = dto.items.reduce((s, it) => s + it.price * it.quantity, 0);
    const order: Order = {
      id: 'o_' + Date.now(),
      buyerId: dto.buyerId,
      items: dto.items,
      total,
      status: 'pending',
      addressId: dto.addressId,
      note: dto.note,
      createdAt: new Date(),
    };
    const arr = this.orders.get(dto.buyerId) ?? [];
    arr.push(order);
    this.orders.set(dto.buyerId, arr);

    // clear cart for buyer (optional)
    this.carts.delete(dto.buyerId);

    return this.ok(order, { message: 'Order created' });
  }

  getOrder(buyerId: string, id: string) {
    const arr = this.orders.get(buyerId) ?? [];
    const order = arr.find(o => o.id === id) ?? null;
    return this.ok(order);
  }

  listOrders(buyerId: string, q: OrderQueryDto) {
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 20);
    let arr = this.orders.get(buyerId) ?? [];
    if (q.status) arr = arr.filter(o => o.status === q.status);
    const total = arr.length;
    const data = arr.slice((page - 1) * limit, page * limit);
    return this.ok(data, { page, limit, total });
  }

  // --- Profile ---
  replaceProfile(buyerId: string, dto: BuyerProfileDto) {
    const entity: BuyerProfile = {
      buyerId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      defaultAddressId: dto.defaultAddressId,
      updatedAt: new Date(),
    };
    this.profiles.set(buyerId, entity);
    return this.ok(entity, { message: 'Profile saved' });
  }
}
