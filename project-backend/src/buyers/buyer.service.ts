import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Cart, CartItem } from 'src/cart/entities/cart.entity';
import { Order, OrderStatus } from 'src/orders/entities/order.entity';
import { BuyerProfile } from './buyer-profile.entity';
import { AddToCartDto } from 'src/cart/dto/add-to-cart.dto';
import { UpdateCartItemDto } from 'src/cart/dto/update-cart-item.dto';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrderQueryDto } from 'src/orders/dto/order-query.dto';
import { BuyerProfileDto } from './dto/buyerProfileDtos/profile.dto';
import { UpdateBuyerStatusDto } from './dto/buyerProfileDtos/update-buyerStatus.dto';
import { GetInactiveBuyersDto } from './dto/buyerProfileDtos/getInactive-buyer.dto';
import { GetBuyersOverAgeDto } from './dto/buyerProfileDtos/getOverage-buyer.dto';
import * as fs from 'fs';
import { Response } from 'express';
import { UpdateBuyerProfileDto } from './dto/buyerProfileDtos/update-buyer-profile.dto';
import { OrderItem } from 'src/orders/entities/order-items.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/sellers/entities/product.entity';
import { Review } from 'src/reviews/review.entity';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { InventoryService } from 'src/inventory/inventory.service';
import { PaymentsService } from 'src/payments/payments.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { MailerService } from 'src/mailer/mailer.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(BuyerProfile)
    private buyerProfileRepository: Repository<BuyerProfile>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

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
    private inventoryService: InventoryService,
    private paymentsService: PaymentsService,
    private notificationsService: NotificationsService,
    private mailerService: MailerService,
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
  async replaceProfile(userId: string, dto: UpdateBuyerProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const match = await bcrypt.compare(dto.currentPassword || '', user.passwordHash || '');
    if (!match) {
      throw new ForbiddenException('Invalid password');
    }

    const existingProfile = await this.buyerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!existingProfile) {
      throw new NotFoundException('Buyer not found');
    }

    const orginalData = { ...existingProfile };

    // Update all fields
    const { currentPassword, ...profileUpdates } = dto;
    const updatedProfile = await this.buyerProfileRepository.save({
      ...existingProfile,
      ...profileUpdates,
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

  async getProfile(userId: string) {
    const profile = await this.buyerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Buyer not found');
    }
    return this.Success(profile);
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
    const inventory = await this.inventoryService.getOrCreate(product.id, product.sellerUserId);
    if (inventory.available < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
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
      const nextQty = cartItem.quantity + dto.quantity;
      if (inventory.available + cartItem.quantity < nextQty) {
        throw new BadRequestException('Insufficient stock');
      }
      cartItem.quantity = nextQty;
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
      id: item.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
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

    const items = (cart.items ?? []).map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    return this.Success({
      userId: cart.userId,
      coupon: cart.coupon ?? null,
      items,
    });
  }

  // --- Orders operations ---
  async createOrder(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }
    const paymentMethod = dto.paymentMethod ?? 'COD';

    const adjustments: Array<{
      productId: string;
      name: string;
      requested: number;
      available: number;
      adjusted: number;
    }> = [];

    const normalizedItems: Array<{ product: Product; quantity: number }> = [];
    for (const itemDto of dto.items) {
      const product = await this.productRepository.findOne({
        where: { id: itemDto.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product ${itemDto.productId} not found`);
      }
      const inventory = await this.inventoryService.getOrCreate(
        product.id,
        product.sellerUserId,
      );
      const available = inventory.available;
      let quantity = itemDto.quantity;
      if (available <= 0) {
        adjustments.push({
          productId: product.id,
          name: product.name,
          requested: itemDto.quantity,
          available,
          adjusted: 0,
        });
        continue;
      }
      if (available < quantity) {
        adjustments.push({
          productId: product.id,
          name: product.name,
          requested: itemDto.quantity,
          available,
          adjusted: available,
        });
        quantity = available;
      }
      normalizedItems.push({ product, quantity });
    }

    if (!normalizedItems.length) {
      throw new BadRequestException('No items available');
    }

    const order = this.orderRepository.create({
      userId,
      addressId: dto.addressId,
      note: dto.note,
      total: 0, // Will be calculated from items
      status: 'CREATED' as OrderStatus,
      paymentMethod,
      deliveryName: dto.deliveryName,
      deliveryPhone: dto.deliveryPhone,
      deliveryAddress: dto.deliveryAddress,
      deliverySlot: dto.deliverySlot,
    });

    const savedOrder = await this.orderRepository.save(order);

    const reserved: { productId: string; quantity: number; sellerUserId: string }[] = [];
    let orderItems: OrderItem[] = [];
    try {
      // Create order items with seller linkage
      orderItems = await Promise.all(
        normalizedItems.map(async ({ product, quantity }) => {
          await this.inventoryService.reserve(product.id, product.sellerUserId, quantity);
          reserved.push({ productId: product.id, quantity, sellerUserId: product.sellerUserId });
          return this.orderItemRepository.create({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            sellerUserId: product.sellerUserId,
            orderId: savedOrder.id,
            order: savedOrder,
          });
        }),
      );
    } catch (error) {
      for (const item of reserved) {
        await this.inventoryService.releaseReservation(item.productId, item.quantity);
      }
      throw error;
    }

    await this.orderItemRepository.save(orderItems);

    // Calculate and update total
    savedOrder.total = savedOrder.calculateTotal();
    await this.orderRepository.save(savedOrder);

    await this.notificationsService.notifyBuyer(
      userId,
      this.notificationsService.buildPayload(
        'Order placed',
        `Order ${savedOrder.id} has been placed successfully.`,
        { orderId: savedOrder.id, total: savedOrder.total },
      ),
    );

    const notifiedSellers = new Set<string>();
    orderItems.forEach((item) => {
      if (item.sellerUserId) {
        notifiedSellers.add(item.sellerUserId);
      }
    });
    for (const sellerUserId of notifiedSellers) {
      await this.notificationsService.notifySeller(
        sellerUserId,
        this.notificationsService.buildPayload(
          'New order',
          `You have a new order ${savedOrder.id}.`,
          { orderId: savedOrder.id },
        ),
      );
    }

    const paymentIntent = await this.paymentsService.createIntent(
      savedOrder.id,
      userId,
      savedOrder.total,
      paymentMethod === 'ONLINE' ? 'SSLCOMMERZ' : 'COD',
    );

    let gatewayUrl: string | null = null;
    if (paymentMethod === 'ONLINE') {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const session = await this.paymentsService.createSslCommerzSession(
        paymentIntent.id,
        savedOrder.total,
        { email: user?.email, name: user?.email ?? 'Buyer' },
      );
      gatewayUrl = session.gatewayUrl;
    }

    // Clear cart for buyer
    await this.cartItemRepository.delete({ cartUserId: userId });
    await this.cartRepository.delete({ userId });

    // Reload order with items for response
    const completeOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items']
    });

    const buyer = await this.userRepository.findOne({ where: { id: userId } });
    if (buyer?.email) {
      const itemsHtml = orderItems
        .map(
          (item) =>
            `<li>${item.name} × ${item.quantity} — Tk ${item.price}</li>`,
        )
        .join('');
      const html = `
        <h2>Order confirmation</h2>
        <p>Your order <strong>${savedOrder.id}</strong> has been placed.</p>
        <p><strong>Payment:</strong> ${paymentMethod}</p>
        <p><strong>Total:</strong> Tk ${savedOrder.total}</p>
        <p><strong>Delivery:</strong> ${dto.deliveryAddress ?? 'N/A'}</p>
        <ul>${itemsHtml}</ul>
        <p>Thank you for shopping with TOOR-TAJA.</p>
      `;
      await this.mailerService.sendGenericEmail(
        buyer.email,
        `Order ${savedOrder.id} confirmed`,
        html,
      );
    }

    return this.Success(
      { order: completeOrder, paymentIntent, gatewayUrl, adjustments },
      { message: 'Order created successfully' },
    );
  }


  async getOrder(userId: string, id: string) {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: ['items']
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const sanitized = {
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      deliveryName: order.deliveryName,
      deliveryPhone: order.deliveryPhone,
      deliveryAddress: order.deliveryAddress,
      deliverySlot: order.deliverySlot,
      items: (order.items ?? []).map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    return this.Success(sanitized);
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

    const sanitized = orders.map((order) => ({
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      deliveryName: order.deliveryName,
      deliveryPhone: order.deliveryPhone,
      deliveryAddress: order.deliveryAddress,
      deliverySlot: order.deliverySlot,
      items: (order.items ?? []).map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }));

    return this.Success(sanitized, { page, limit, total });
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
    const sanitized = orders.map((order) => ({
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      deliveryName: order.deliveryName,
      deliveryPhone: order.deliveryPhone,
      deliveryAddress: order.deliveryAddress,
      deliverySlot: order.deliverySlot,
      items: (order.items ?? []).map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }));
    return this.Success(sanitized, { total: orders.length });
  }

  async createReview(userId: string, dto: CreateReviewDto) {
    const existing = await this.reviewRepository.findOne({
      where: { userId, orderItemId: dto.orderItemId },
    });
    if (existing) {
      throw new BadRequestException('Review already exists');
    }

    const purchasedItem = await this.orderItemRepository.findOne({
      where: { id: dto.orderItemId, order: { userId } as any },
      relations: ['order'],
    });
    if (!purchasedItem) {
      throw new ForbiddenException('Only purchased products can be reviewed');
    }
    if (purchasedItem.productId !== dto.productId) {
      throw new BadRequestException('Product does not match order item');
    }

    const review = this.reviewRepository.create({
      userId,
      productId: dto.productId,
      orderItemId: dto.orderItemId,
      rating: dto.rating,
      comment: dto.comment,
    });
    const saved = await this.reviewRepository.save(review);
    const [count, average] = await this.reviewRepository
      .createQueryBuilder('review')
      .select('COUNT(review.id)', 'count')
      .addSelect('AVG(review.rating)', 'average')
      .where('review.productId = :productId', { productId: dto.productId })
      .getRawOne();

    await this.productRepository.update(
      { id: dto.productId },
      { ratingCount: Number(count || 0), ratingAverage: Number(average || 0) },
    );
    return this.Success(saved, { message: 'Review created' });
  }
}
