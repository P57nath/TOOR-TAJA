import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { BuyerProfile } from './buyer-profile.entity';
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
import { User } from 'src/users/user.entity';
import { Product } from 'src/seller/entities/product.entity';
import { Review } from 'src/products/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

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

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) { }

  private Success(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

  // --- Buyer Profile ---
  async createBuyer(userId: string, dto: BuyerProfileDto) {
    const buyerProfile = this.buyerProfileRepository.create({
      ...dto,
      user: { id: userId } as User,
    });
    const savedProfile = await this.buyerProfileRepository.save(buyerProfile);

    return this.Success(savedProfile, {
      message: 'Buyer created successfully',
      profileId: savedProfile.id
    });
  }
  // --- Get all buyer profiles ---
  async getAllBuyerProfiles() {
    const buyers = await this.buyerProfileRepository.find();
    return this.Success(buyers, {
      message: 'All buyer profiles retrieved successfully',
      total: buyers.length
    });
  }

  // --- Profile operations ---
  async replaceProfile(userId: string, dto: UpdateBuyerDto) {
    const existingProfile = await this.buyerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!existingProfile) {
      throw new NotFoundException('Buyer not found');
    }

    const orginalData = { ...existingProfile };

    // Update all fields
    const updatedProfile = await this.buyerProfileRepository.save({
      ...existingProfile,
      ...dto,
      updatedAt: new Date(),
    });

    // const changeFields: string[] = [];

    // Object.keys(dto).forEach(key => {
    //   if (dto[key] !== undefined && orginalData[key] !== updatedProfile[key]) {
    //     changeFields.push(`${key} changed from '${orginalData[key]}' to '${updatedProfile[key]}'`);
    //   }
    // });

    return this.Success(updatedProfile, {
      message: 'Profile updated successfully',
      userId
    });
  }
  //Change buyer status to active/inactive
  async updateBuyerStatus(userId: string, dto: UpdateBuyerStatusDto) {
    const profile = await this.buyerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Buyer not found');
    }

    profile.status = dto.status;
    profile.updatedAt = new Date();
    const updatedProfile = await this.buyerProfileRepository.save(profile);

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
      order: { age: 'ASC' }
    });

    return this.Success(buyers, {
      page,
      limit,
      total,
      message: `Buyers over ${age} retrieved successfully`
    });
  }

  // async findAdminsWithNullName() {
  //   const page = query.page || 1;
  //   const limit = query.limit || 10;
  //   const skip = (page - 1) * limit;

  //   const [admins, total] = await this.adminRepository.findAndCount({
  //     where: {
  //       name: IsNull(),
  //       name: ''
  //     },
  //     skip,
  //     take: limit,
  //   });

  //   return this.Success(admins, {
  //     page,
  //     limit,
  //     total,
  //     message: `Admin's with null names retrieved successfully`
  //   });

  // }

  // --- Cart operations ---
  async addToCart(userId: string, dto: AddToCartDto) {
    const product = await this.productRepository.findOne({ where: { id: dto.productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items']
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId });
      await this.cartRepository.save(cart);
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { cartUserId: userId, productId: dto.productId }
    });

    if (cartItem) {
      // Update existing item
      cartItem.quantity += dto.quantity;
      cartItem.price = product.price;
      cartItem.name = product.name;
    } else {
      // Create new item
      cartItem = this.cartItemRepository.create({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: dto.quantity,
        cartUserId: userId,
        cart: cart
      });
    }

    await this.cartItemRepository.save(cartItem);

    // Reload cart with items
    const updatedCart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items']
    });

    if (!updatedCart) {
      throw new NotFoundException('Cart not found after update');
    }

    const filteredItems = updatedCart.items.map(item => ({
      productId: item.productId,
      name: item.name,
    }));

    return this.Success(
      { userId: updatedCart.userId, items: filteredItems },
      { message: 'Item added to cart' }
    );
  }

  async updateCartItem(userId: string, itemId: number, dto: UpdateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cartUserId: userId }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = dto.quantity;
    await this.cartItemRepository.save(cartItem);

    const updatedCart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items']
    });

    return this.Success(updatedCart, { message: 'Cart item updated' });
  }

  async removeCartItem(userId: string, itemId: number) {
    const result = await this.cartItemRepository.delete({
      id: itemId,
      cartUserId: userId
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }

    const updatedCart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items']
    });

    return this.Success(
      { removed: result.affected, cart: updatedCart },
      { message: 'Cart item removed' }
    );
  }

  async getCart(userId: string, coupon?: string) {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items']
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
    }

    if (coupon) {
      cart.coupon = coupon;
      await this.cartRepository.save(cart);
    }

    return this.Success(cart);
  }

  // --- Orders operations ---
  async createOrder(userId: string, dto: CreateOrderDto) {
    const order = this.orderRepository.create({
      userId,
      addressId: dto.addressId,
      note: dto.note,
      total: 0, // Will be calculated from items
      status: 'pending' as OrderStatus,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items with seller linkage
    const orderItems = await Promise.all(
      dto.items.map(async (itemDto) => {
        const product = await this.productRepository.findOne({
          where: { id: itemDto.productId },
        });
        if (!product) {
          throw new NotFoundException(`Product ${itemDto.productId} not found`);
        }
        return this.orderItemRepository.create({
          productId: itemDto.productId,
          name: product.name,
          price: product.price,
          quantity: itemDto.quantity,
          sellerUserId: product.sellerUserId,
          orderId: savedOrder.id,
          order: savedOrder,
        });
      }),
    );

    await this.orderItemRepository.save(orderItems);

    // Calculate and update total
    savedOrder.total = savedOrder.calculateTotal();
    await this.orderRepository.save(savedOrder);

    // Clear cart for buyer
    await this.cartItemRepository.delete({ cartUserId: userId });
    await this.cartRepository.delete({ userId });

    // Reload order with items for response
    const completeOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items']
    });

    return this.Success(completeOrder, { message: 'Order created successfully' });
  }


  async getOrder(userId: string, id: string) {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: ['items']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.Success(order);
  }

  async listOrders(userId: string, q: OrderQueryDto) {
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 20);
    const skip = (page - 1) * limit;

    const where: any = { userId };
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

  async listBuyers(orderId: string) {
  
    const orderItems = await this.orderItemRepository.find({
      where: { orderId },
      relations: ['order'],
    });

    const buyers = orderItems.map(item => item.order.userId);

    const total = await this.orderItemRepository.count({
      where: { orderId },
    });

    return this.Success(buyers, {total });
  }

  // --- Document operations ---
  async uploadDocument(userId: string, dto: any, file: Express.Multer.File) {
    const documentInfo = {
      userId,
      documentType: dto.documentType,
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      uploadedAt: new Date(),
    };

    return this.Success(documentInfo, { message: 'PDF document uploaded successfully' });
  }

  async getDocumentInfo(userId: string, filename: string) {
    const filePath = `./upload/buyer-documents/${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Document not found');
    }

    const stats = fs.statSync(filePath);
    const documentInfo = {
      userId,
      filename,
      filePath,
      fileSize: stats.size,
      uploadedAt: stats.birthtime,
      lastModified: stats.mtime,
    };

    return this.Success(documentInfo, { message: 'Document info retrieved' });
  }

  async downloadDocument(userId: string, filename: string, res: Response) {
    const filePath = `./upload/buyer-documents/${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Document not found');
    }

    res.sendFile(require('path').resolve(filePath));
  }

  async listMyOrders(userId: string) {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return this.Success(orders, { total: orders.length });
  }

  async createReview(userId: string, dto: CreateReviewDto) {
    const existing = await this.reviewRepository.findOne({
      where: { userId, productId: dto.productId },
    });
    if (existing) {
      throw new BadRequestException('Review already exists');
    }

    const purchased = await this.orderItemRepository.findOne({
      where: { productId: dto.productId, order: { userId } as any },
      relations: ['order'],
    });
    if (!purchased) {
      throw new ForbiddenException('Only purchased products can be reviewed');
    }

    const review = this.reviewRepository.create({
      userId,
      productId: dto.productId,
      rating: dto.rating,
      comment: dto.comment,
    });
    const saved = await this.reviewRepository.save(review);
    return this.Success(saved, { message: 'Review created' });
  }
}
