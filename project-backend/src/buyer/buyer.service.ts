import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { BuyerProfile } from './entities/buyer-profile.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { BuyerProfileDto } from './dto/buyerProfileDtos/profile.dto';
import { UpdateBuyerStatusDto } from './dto/buyerProfileDtos/update-buyerStatus.dto';
import { GetInactiveBuyersDto } from './dto/buyerProfileDtos/getInactive-buyer.dto';
import { GetBuyersOverAgeDto } from './dto/buyerProfileDtos/getOverage-buyer.dto';
import * as fs from 'fs';
import { Response } from 'express';
import { UpdateBuyerDto } from './dto/buyerProfileDtos/update-buyer.dto';
import { OrderItem } from './entities/order-items.entity';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(BuyerProfile)
    private buyerProfileRepository: Repository<BuyerProfile>,

    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) { }

  private Success(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

  // --- Buyer Profile ---
  async createBuyer(dto: BuyerProfileDto) {
    const buyerProfile = this.buyerProfileRepository.create(dto);
    const savedProfile = await this.buyerProfileRepository.save(buyerProfile);

    return this.Success(savedProfile, {
      message: 'Buyer created successfully',
      buyerId: savedProfile.buyerId
    });
  }

  // --- Profile operations ---
  async replaceProfile(buyerId: string, dto: UpdateBuyerDto) {
    const existingProfile = await this.buyerProfileRepository.findOne({
      where: { buyerId }
    });

    if (!existingProfile) {
      throw new NotFoundException('Buyer not found');
    }

    // Update all fields
    const updatedProfile = await this.buyerProfileRepository.save({
      ...existingProfile,
      ...dto,
      updatedAt: new Date(),
    });

    return this.Success(updatedProfile, {
      message: 'Profile updated successfully',
      buyerId
    });
  }
  //Change buyer status to active/inactive
  async updateBuyerStatus(buyerId: string, dto: UpdateBuyerStatusDto) {
    const result = await this.buyerProfileRepository.update(
      { buyerId },
      {
        status: dto.status,
        updatedAt: new Date()
      }
    );

    if (result.affected === 0) {
      throw new NotFoundException('Buyer not found');
    }

    const updatedProfile = await this.buyerProfileRepository.findOne({
      where: { buyerId }
    });

    return this.Success(updatedProfile, {
      message: `Buyer status updated to ${dto.status}`
    });
  }

  //Retrieve list of inactive users
  async getInactiveBuyers(query: GetInactiveBuyersDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [buyers, total] = await this.buyerProfileRepository.findAndCount({
      where: { status: 'inactive' },
      skip,
      take: limit,
      order: { updatedAt: 'DESC' }
    });

    return this.Success(buyers, {
      page,
      limit,
      total,
      message: 'Inactive buyers retrieved successfully'
    });
  }

  //Get list of users older than 40
  async getBuyersOver40(query: GetBuyersOverAgeDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [buyers, total] = await this.buyerProfileRepository.findAndCount({
      where: {
        age: MoreThan(40)
      },
      skip,
      take: limit,
      order: { age: 'DESC' }
    });

    return this.Success(buyers, {
      page,
      limit,
      total,
      message: 'Buyers over 40 retrieved successfully'
    });
  }

  //Get list of users older than specific age
  async getBuyersOverAge(age: number, query: GetBuyersOverAgeDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [buyers, total] = await this.buyerProfileRepository.findAndCount({
      where: {
        age: MoreThan(age)
      },
      skip,
      take: limit,
      order: { age: 'DESC' }
    });

    return this.Success(buyers, {
      page,
      limit,
      total,
      message: `Buyers over ${age} retrieved successfully`
    });
  }

  // --- Cart operations ---
  async addToCart(buyerId: string, dto: AddToCartDto) {
    let cart = await this.cartRepository.findOne({
      where: { buyerId },
      relations: ['items']
    });

    if (!cart) {
      cart = this.cartRepository.create({ buyerId });
      await this.cartRepository.save(cart);
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { cartBuyerId: buyerId, productId: dto.productId }
    });

    if (cartItem) {
      // Update existing item
      cartItem.quantity += dto.quantity;
      cartItem.price = dto.price;
    } else {
      // Create new item
      cartItem = this.cartItemRepository.create({
        ...dto,
        cartBuyerId: buyerId,
        cart: cart
      });
    }

    await this.cartItemRepository.save(cartItem);

    // Reload cart with items
    const updatedCart = await this.cartRepository.findOne({
      where: { buyerId },
      relations: ['items']
    });

    if(!updatedCart) {
      throw new NotFoundException('Cart not found after update');
    }

    const filteredItems = updatedCart.items.map(item => ({
      productId: item.productId,
      name: item.name,
    }));

    return this.Success(
      { buyerId: updatedCart.buyerId, items: filteredItems },
      { message: 'Item added to cart' }
    );
  }

  async updateCartItem(buyerId: string, productId: string, dto: UpdateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cartBuyerId: buyerId, productId: productId }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = dto.quantity;
    await this.cartItemRepository.save(cartItem);

    const updatedCart = await this.cartRepository.findOne({
      where: { buyerId },
      relations: ['items']
    });

    return this.Success(updatedCart, { message: 'Cart item updated' });
  }

  async removeCartItem(buyerId: string, productId: string) {
    const result = await this.cartItemRepository.delete({
      cartBuyerId: buyerId,
      productId: productId
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }

    const updatedCart = await this.cartRepository.findOne({
      where: { buyerId },
      relations: ['items']
    });

    return this.Success(
      { removed: result.affected, cart: updatedCart },
      { message: 'Cart item removed' }
    );
  }

  async getCart(buyerId: string, coupon?: string) {
    let cart = await this.cartRepository.findOne({
      where: { buyerId },
      relations: ['items']
    });

    if (!cart) {
      cart = this.cartRepository.create({ buyerId, items: [] });
      await this.cartRepository.save(cart);
    }

    if (coupon) {
      cart.coupon = coupon;
      await this.cartRepository.save(cart);
    }

    return this.Success(cart);
  }

  // --- Orders operations ---
  async createOrder(dto: CreateOrderDto) {
    const order = this.orderRepository.create({
      buyerId: dto.buyerId,
      addressId: dto.addressId,
      note: dto.note,
      total: 0, // Will be calculated from items
      status: 'pending' as OrderStatus,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItems = dto.items.map(itemDto =>
      this.orderItemRepository.create({
        ...itemDto,
        orderId: savedOrder.id,
        order: savedOrder
      })
    );

    await this.orderItemRepository.save(orderItems);

    // Calculate and update total
    savedOrder.total = savedOrder.calculateTotal();
    await this.orderRepository.save(savedOrder);

    // Clear cart for buyer
    await this.cartItemRepository.delete({ cartBuyerId: dto.buyerId });
    await this.cartRepository.delete({ buyerId: dto.buyerId });

    // Reload order with items for response
    const completeOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items']
    });

    return this.Success(completeOrder, { message: 'Order created successfully' });
  }


  async getOrder(buyerId: string, id: string) {
    const order = await this.orderRepository.findOne({
      where: { id, buyerId },
      relations: ['items']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.Success(order);
  }

  async listOrders(buyerId: string, q: OrderQueryDto) {
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 20);
    const skip = (page - 1) * limit;

    const where: any = { buyerId };
    if (q.status) {
      where.status = q.status;
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['items'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return this.Success(orders, { page, limit, total });
  }

  // --- Document operations ---
  async uploadDocument(buyerId: string, dto: any, file: Express.Multer.File) {
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

  async getDocumentInfo(buyerId: string, filename: string) {
    const filePath = `./upload/buyer-documents/${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Document not found');
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

  async downloadDocument(buyerId: string, filename: string, res: Response) {
    const filePath = `./upload/buyer-documents/${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Document not found');
    }

    res.sendFile(require('path').resolve(filePath));
  }
}