import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem } from './entities/cart.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { BuyerProfile } from './entities/buyer-profile.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { BuyerProfileDto } from './dto/profile.dto';
import * as fs from 'fs';
import { Response } from 'express';

@Injectable()
export class BuyerService {
  private carts = new Map<string, Cart>();      
  private orders = new Map<string, Order[]>();  

  private buyerCounter = 1;

  private profiles: BuyerProfile[] = [
    {
      buyerId: 'buyer_1',
      name: 'John Doe',
      email: 'JohnDoe@gmail.com',
      password: 'passWord123',
      phone: '01782641610',
      defaultAddressId: 'addr_1',
      updatedAt: new Date(),
    },
  ];

  private Success(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  } 

  // --- Buyer Profile ---
  createBuyer(dto: BuyerProfileDto) {
    this.buyerCounter++;                        
    const buyerId = `buyer_${this.buyerCounter}`;

    const entity: BuyerProfile = {
      buyerId,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      defaultAddressId: dto.defaultAddressId,
      updatedAt: new Date(),
    };

    this.profiles.push(entity);

    return this.Success(entity, { message: 'Buyer created', buyerId });
  }

  // --- Profile operations ---
  replaceProfile(buyerId: string, dto: BuyerProfileDto) {
    const idx = this.profiles.findIndex(p => p.buyerId === buyerId);

    if (idx === -1) {
      return this.Success(null, { message: 'Buyer not found' });
    }

    const entity: BuyerProfile = {
      buyerId,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      defaultAddressId: dto.defaultAddressId,
      updatedAt: new Date(),
    };

    this.profiles[idx] = entity;

    return this.Success(entity, { message: 'Profile updated', buyerId });
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

    const filteredItems = cart.items.map(item => ({
    productId: item.productId,
    name: item.name,
    }));
    //return this.ok( cart, { message: 'Item added to cart' });
    return this.Success({ buyerId: cart.buyerId, items: filteredItems }, { message: 'Item added to cart' });
  }

  updateCartItem(buyerId: string, productId: string, dto: UpdateCartItemDto) {
    const cart = this.carts.get(buyerId);
    if (!cart) return this.Success(null, { message: 'Cart not found' });
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return this.Success(null, { message: 'Item not found' });
    item.quantity = dto.quantity;
    cart.updatedAt = new Date();
    return this.Success(cart, { message: 'Cart item updated' });
  }

  removeCartItem(buyerId: string, productId: string) {
    const cart = this.carts.get(buyerId);
    if (!cart) return this.Success(null, { message: 'Cart not found' });
    const before = cart.items.length;
    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.updatedAt = new Date();
    return this.Success({ removed: before - cart.items.length, cart }, { message: 'Cart item removed' });
  }

  getCart(buyerId: string, coupon?: string) {
    const cart = this.carts.get(buyerId) ?? { buyerId, items: [], updatedAt: new Date() };
    if (coupon) cart.coupon = coupon;
    return this.Success(cart);
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

    return this.Success(order, { message: 'Order created' });
  }

  getOrder(buyerId: string, id: string) {
    const arr = this.orders.get(buyerId) ?? [];
    const order = arr.find(o => o.id === id) ?? null;
    return this.Success(order);
  }

  // listOrders(buyerId: string, q: { status?: OrderStatus; page: number; limit: number }) {
  // let arr = this.orders.get(buyerId) ?? [];
  // if (q.status) arr = arr.filter(o => o.status === q.status);
  // const total = arr.length;
  // const data = arr.slice((q.page - 1) * q.limit, q.page * q.limit);
  // return this.Success(data, { page: q.page, limit: q.limit, total });
  // }
  listOrders(buyerId: string, q: OrderQueryDto) {
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 20);
    let arr = this.orders.get(buyerId) ?? [];
    if (q.status) arr = arr.filter(o => o.status === q.status);
    const total = arr.length;
    const data = arr.slice((page - 1) * limit, page * limit);
    return this.Success(data, { page, limit, total });
  }

  uploadDocument(buyerId: string, dto: any, file: Express.Multer.File) {
    const documentInfo = {
      buyerId,
      documentType: dto.documentType,
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      uploadedAt: new Date(),
    };
    
    return this.Success(documentInfo, { message: 'PDF document uploaded successfully' });
  }

    getDocumentInfo(buyerId: string, filename: string) {
    const filePath = `./upload/buyer-documents/${filename}`;
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return this.Success(null, { message: 'Document not found' });
    }

    const stats = fs.statSync(filePath);
    const documentInfo = {
      buyerId,
      filename,
      filePath,
      fileSize: stats.size,
      uploadedAt: stats.birthtime,
      lastModified: stats.mtime,
    };

    return this.Success(documentInfo, { message: 'Document info retrieved' });
  }

  downloadDocument(buyerId: string, filename: string, res: Response) {
  const filePath = `./upload/buyer-documents/${filename}`;
  
  if (!fs.existsSync(filePath)) {
    throw new NotFoundException('Document not found');
  }
  res.sendFile(require('path').resolve(filePath));
}
  
}
