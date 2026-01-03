import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { Category } from 'src/products/category.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { SellerProfile } from './seller-profile.entity';
import { Order, OrderStatus } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-items.entity';
import { InventoryService } from 'src/inventory/inventory.service';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerProfile)
    private sellerProfileRepo: Repository<SellerProfile>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private inventoryService: InventoryService,
    private readonly mailerService: MailerService,
  ) {}

  private ok(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }



  
  // async createUser(dto: CreateSellerDto) {
    
  //   const seller = this.sellerRepo.create(dto);
  //   await this.sellerRepo.save(seller);

    
  //   return this.ok(
  //     {
  //       id: seller.id,
  //       username: seller.username,
  //       fullName: seller.fullName,
  //       isActive: seller.isActive,
  //       email: seller.email,
  //       gender: seller.gender,
  //       phoneNumber: seller.phoneNumber,
  //       createdAt: seller.createdAt,
  //     },
  //     { message: 'User created successfully' },
  //   );
  // }

  // Get seller with all their products
  async getSellerWithProducts(userId: string) {
    const profile = await this.sellerProfileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(`Seller profile for user ${userId} not found`);
    }

    const products = await this.productRepo.find({
      where: { sellerUserId: userId },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });

    return { profile, products };
  }

  async createProfile(userId: string, dto: { storeName: string; phone?: string }) {
    const existing = await this.sellerProfileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (existing) {
      throw new ForbiddenException('Profile already exists');
    }

    const profile = this.sellerProfileRepo.create({
      user: { id: userId } as any,
      storeName: dto.storeName,
      phone: dto.phone,
      status: 'PENDING',
    });
    const saved = await this.sellerProfileRepo.save(profile);
    return this.ok(saved, { message: 'Seller profile created' });
  }

  async getProfile(userId: string) {
    const profile = await this.sellerProfileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Seller profile not found');
    }
    return this.ok(profile);
  }

  



  async createProduct(
    sellerUserId: string,
    dto: CreateProductDto,
    imagePath?: string | null,
  ) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId, isActive: true },
    });
    if (!category) {
      throw new NotFoundException('Category not found or inactive');
    }

    const finalDto = {
      ...dto,
      stock: dto.stock ?? 0,
      sellerUserId,
      imagePath: imagePath ?? null,
    };
    const product = this.productRepo.create(finalDto);
    product.category = category;
    await this.productRepo.save(product);
    await this.inventoryService.getOrCreate(product.id, sellerUserId);
    return this.ok(product, { message: 'Product created' });
  }

  async createInventory(sellerUserId: string, dto: { productId: string; stock: number }) {
    const product = await this.productRepo.findOne({ where: { id: dto.productId, sellerUserId } });
    if (!product) {
      throw new NotFoundException(`Product with ID '${dto.productId}' not found`);
    }

    product.stock = dto.stock;
    product.updatedAt = new Date();
    const saved = await this.productRepo.save(product);
    await this.inventoryService.setStock(saved.id, sellerUserId, dto.stock);
    return this.ok(saved, { message: 'Inventory created' });
  }

  async updateInventory(sellerUserId: string, productId: string, stock: number) {
    const product = await this.productRepo.findOne({ where: { id: productId, sellerUserId } });
    if (!product) {
      throw new NotFoundException(`Product with ID '${productId}' not found`);
    }

    product.stock = stock;
    product.updatedAt = new Date();
    const saved = await this.productRepo.save(product);
    await this.inventoryService.setStock(saved.id, sellerUserId, stock);
    return this.ok(saved, { message: 'Inventory updated' });
  }

  async listOrders(sellerUserId: string) {
    const items = await this.orderItemRepository.find({
      where: { sellerUserId },
      relations: ['order'],
    });

    const ordersById = new Map<string, Order>();
    for (const item of items) {
      const order = ordersById.get(item.orderId) ?? item.order;
      if (!ordersById.has(order.id)) {
        order.items = [];
        ordersById.set(order.id, order);
      }
      order.items.push(item);
    }

    return this.ok(Array.from(ordersById.values()), { total: ordersById.size });
  }

  async updateOrderStatus(sellerUserId: string, orderId: string, status: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const foreignItem = order.items.find((item) => item.sellerUserId !== sellerUserId);
    if (foreignItem) {
      throw new ForbiddenException('Cannot update status for multi-seller order');
    }

    if (!['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status)) {
      throw new ForbiddenException('Seller can update only fulfillment statuses');
    }

    const allowed: Record<OrderStatus, OrderStatus[]> = {
      CREATED: ['PAID', 'CANCELLED'],
      PAID: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: [],
    };
    if (!allowed[order.status]?.includes(status)) {
      throw new ForbiddenException('Invalid status transition');
    }

    order.updateStatus(status);
    const saved = await this.orderRepository.save(order);
    return this.ok(saved, { message: 'Order status updated' });
  }

  async findAllProducts(sellerUserId: string, categoryId?: string) {
    const where: any = { sellerUserId };
    if (categoryId) {
      where.categoryId = categoryId;
    }
    const products = await this.productRepo.find({
      where,
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
    return this.ok(products, { message: `Found ${products.length} products` });
  }

  async findProduct(sellerUserId: string, id: string) {
    const product = await this.productRepo.findOne({
      where: { id, sellerUserId },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return this.ok(product, { message: 'Product found' });
  }

  async updateProduct(sellerUserId: string, id: string, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({
      where: { id, sellerUserId },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId, isActive: true },
      });
      if (!category) {
        throw new NotFoundException('Category not found or inactive');
      }
      product.category = category;
      product.categoryId = category.id;
    }

    Object.assign(product, dto, { updatedAt: new Date() });
    await this.productRepo.save(product);

    return this.ok(product, { message: 'Product updated' });
  }

  async removeProduct(sellerUserId: string, id: string) {
    const result = await this.productRepo.delete({ id, sellerUserId });

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID '${id}' not found for deletion`);
    }

    return this.ok(null, { message: `Product ID '${id}' successfully removed` });
  }

  async notifySellerOfLowStock(sellerEmail: string, sellerName: string, productName: string, currentStock: number) {
    const html = `
      <h1>Low Stock Alert</h1>
      <p>Hi ${sellerName},</p>
      <p>The following product has low stock:</p>
      <p><strong>Product Name:</strong> ${productName}</p>
      <p><strong>Current Stock:</strong> ${currentStock}</p>
      <p>Please consider restocking this item.</p>
      <br/>
      <p>TOOR-TAJA Team</p>
    `;
    return await this.mailerService.sendGenericEmail(sellerEmail, 'Low Stock Alert', html);
  }

  async notifySellerOfNewOrder(sellerEmail: string, sellerName: string, orderId: string, productCount: number, totalAmount: number) {
    const html = `
      <h1>New Order Received</h1>
      <p>Hi ${sellerName},</p>
      <p>A new order has been placed on TOOR-TAJA!</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Number of Products:</strong> ${productCount}</p>
      <p><strong>Total Amount:</strong> $${totalAmount}</p>
      <p>Please prepare the order for shipment.</p>
      <br/>
      <p>Thank you,<br/>TOOR-TAJA Team</p>
    `;
    return await this.mailerService.sendGenericEmail(sellerEmail, `New Order - ${orderId}`, html);
  }
}
