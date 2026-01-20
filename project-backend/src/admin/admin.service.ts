import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { SellerProfile, SellerStatus } from 'src/sellers/seller-profile.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Category } from 'src/products/category.entity';
import { SubCategory } from 'src/products/subcategory.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Dispute } from 'src/disputes/dispute.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AdminProfile } from './admin-profile.entity';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import * as bcrypt from 'bcrypt';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { PaymentIntent } from 'src/payments/payment-intent.entity';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SellerProfile)
    private sellerProfileRepository: Repository<SellerProfile>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subcategoryRepository: Repository<SubCategory>,
    @InjectRepository(Dispute)
    private disputeRepository: Repository<Dispute>,
    @InjectRepository(AdminProfile)
    private adminProfileRepository: Repository<AdminProfile>,
    @InjectRepository(PaymentIntent)
    private paymentRepository: Repository<PaymentIntent>,
    private readonly mailerService: MailerService,
    private readonly notificationsService: NotificationsService,
  ) { }

  private ok(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

  async dashboard() {
    const [sellerCount, pendingSellers, orderCount, disputeCount] = await Promise.all([
      this.userRepository.count({ where: { role: Role.SELLER } }),
      this.sellerProfileRepository.count({ where: { status: 'PENDING' } }),
      this.orderRepository.count(),
      this.disputeRepository.count({ where: { status: 'OPEN' } }),
    ]);

    return this.ok({
      sellers: sellerCount,
      pendingSellers,
      orders: orderCount,
      openDisputes: disputeCount,
    });
  }

  async listSellers(status?: string) {
    let normalized: SellerStatus | undefined;
    if (status) {
      const upper = status.toUpperCase();
      if (!['PENDING', 'APPROVED', 'SUSPENDED'].includes(upper)) {
        throw new BadRequestException('Invalid status');
      }
      normalized = upper as SellerStatus;
    }

    const sellers = await this.sellerProfileRepository.find({
      where: normalized ? { status: normalized } : {},
      relations: ['user'],
    });

    return this.ok(sellers, { total: sellers.length });
  }

  async approveSeller(sellerProfileId: string) {
    const profile = await this.sellerProfileRepository.findOne({
      where: { id: sellerProfileId },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Seller not found');
    if (profile.status === 'APPROVED') {
      throw new BadRequestException('Seller already approved');
    }

    profile.status = 'APPROVED';
    await this.sellerProfileRepository.save(profile);
    if (profile.user && !profile.user.isActive) {
      profile.user.isActive = true;
      await this.userRepository.save(profile.user);
    }
    await this.mailerService.sendSellerApprovedEmail(profile.user.email, profile.storeName);
    await this.notificationsService.notifySeller(
      profile.user.id,
      this.notificationsService.buildPayload(
        'Seller approved',
        `Your seller account for ${profile.storeName} is approved.`,
        { sellerProfileId: profile.id },
      ),
    );
    return this.ok(profile, { message: 'Seller approved' });
  }

  async suspendSeller(sellerProfileId: string) {
    const profile = await this.sellerProfileRepository.findOne({
      where: { id: sellerProfileId },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Seller not found');
    if (profile.status === 'SUSPENDED') {
      throw new BadRequestException('Seller already suspended');
    }

    profile.status = 'SUSPENDED';
    await this.sellerProfileRepository.save(profile);
    if (profile.user && profile.user.isActive) {
      profile.user.isActive = false;
      await this.userRepository.save(profile.user);
    }
    await this.notificationsService.notifySeller(
      profile.user.id,
      this.notificationsService.buildPayload(
        'Seller suspended',
        `Your seller account for ${profile.storeName} is suspended.`,
        { sellerProfileId: profile.id },
      ),
    );
    return this.ok(profile, { message: 'Seller suspended' });
  }

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.categoryRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new BadRequestException('Category already exists');
    }
    const category = this.categoryRepository.create({ name: dto.name });
    const saved = await this.categoryRepository.save(category);
    return this.ok(saved, { message: 'Category created' });
  }

  async listCategories() {
    const categories = await this.categoryRepository.find({
      relations: ['subcategories'],
      order: { createdAt: 'DESC' },
    });
    return this.ok(categories, { total: categories.length });
  }

  async deleteCategory(id: string) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
    return this.ok(null, { message: 'Category deleted' });
  }

  async listSubcategories(categoryId: string) {
    const items = await this.subcategoryRepository.find({
      where: { categoryId },
      order: { name: 'ASC' },
    });
    return this.ok(items, { total: items.length });
  }

  async createSubcategory(
    categoryId: string,
    dto: CreateSubCategoryDto,
    imagePath?: string | null,
  ) {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const existing = await this.subcategoryRepository.findOne({
      where: { name: dto.name, categoryId },
    });
    if (existing) {
      throw new BadRequestException('Subcategory already exists');
    }
    const subcategory = this.subcategoryRepository.create({
      name: dto.name,
      categoryId,
      category,
      imagePath: imagePath ?? null,
    });
    const saved = await this.subcategoryRepository.save(subcategory);
    return this.ok(saved, { message: 'Subcategory created' });
  }

  async deleteSubcategory(id: string) {
    const result = await this.subcategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Subcategory not found');
    }
    return this.ok(null, { message: 'Subcategory deleted' });
  }

  async listOrders() {
    const orders = await this.orderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return this.ok(orders, { total: orders.length });
  }

  async listPayments() {
    const intents = await this.paymentRepository.find({
      order: { createdAt: 'DESC' },
    });
    return this.ok(intents, { total: intents.length });
  }


  async listDisputes() {
    const disputes = await this.disputeRepository.find({
      order: { createdAt: 'DESC' },
    });
    return this.ok(disputes, { total: disputes.length });
  }

  async resolveDispute(id: string, resolutionNote?: string) {
    const dispute = await this.disputeRepository.findOne({ where: { id } });
    if (!dispute) throw new NotFoundException('Dispute not found');

    dispute.status = 'RESOLVED';
    dispute.resolutionNote = resolutionNote;
    dispute.resolvedAt = new Date();
    const saved = await this.disputeRepository.save(dispute);
    return this.ok(saved, { message: 'Dispute resolved' });
  }

  async getProfile(userId: string) {
    const profile = await this.adminProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Admin profile not found');
    }
    return this.ok(profile);
  }

  async updateProfile(userId: string, dto: UpdateAdminProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const match = await bcrypt.compare(dto.currentPassword || '', user.passwordHash || '');
    if (!match) {
      throw new BadRequestException('Invalid password');
    }

    const profile = await this.adminProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Admin profile not found');
    }

    const { currentPassword, ...updates } = dto;
    Object.assign(profile, updates);
    const saved = await this.adminProfileRepository.save(profile);
    return this.ok(saved, { message: 'Admin profile updated' });
  }

}
