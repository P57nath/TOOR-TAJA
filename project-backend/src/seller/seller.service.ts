import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { Seller } from './entities/seller.entity';
import { Product } from './entities/product.entity';

import { CreateSellerDto } from './dto/create-seller.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepo: Repository<Seller>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  private ok(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

  // ----------------------------------------------------------
  // USER OPERATIONS (REPOSITORY BASED) — REQUIRED BY YOU
  // ----------------------------------------------------------

  // 1️⃣ Create a User
  async createUser(dto: CreateSellerDto) {
    const seller = this.sellerRepo.create(dto);
    await this.sellerRepo.save(seller);

    // SELECT-style output:
    return this.ok(
      {
        phoneNumber: seller.phoneNumber,
        createdAt: seller.createdAt,
      },
      { message: 'Seller User registered successfully' },
    );
  }

  // 2️⃣ Retrieve users whose fullName contains a substring
  async findUsersByFullName(substring: string) {
    const users = await this.sellerRepo.find({
      where: { fullName: Like(`%${substring}%`) },

      // SELECT-like query (only return specific properties)
      select: {
        username: true,
        fullName: true,
      },
    });

    return this.ok(users, { count: users.length });
  }

  // 3️⃣ Retrieve a user by unique username
  async findUserByUsername(username: string) {
    const user = await this.sellerRepo.findOne({
      where: { username },
      select: {
        username: true,
        fullName: true,
        email: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.ok(user);
  }

  // 4️⃣ Remove user by username
  async removeUserByUsername(username: string) {
    const result = await this.sellerRepo.delete({ username });

    return this.ok(
      { removed: result.affected },
      { message: 'User removed successfully' },
    );
  }

  // ----------------------------------------------------------
  // PRODUCT OPERATIONS (NOW USING REPOSITORIES)
  // ----------------------------------------------------------

  async createProduct(dto: CreateProductDto) {
    const product = this.productRepo.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.productRepo.save(product);

    return this.ok(product, { message: 'Product created' });
  }

  async findAllProducts(category?: string) {
    const data = await this.productRepo.find(
      category
        ? { where: { category } }
        : {},
    );

    return this.ok(data, { count: data.length });
  }

  async findProduct(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    return this.ok(product ?? null);
  }

  async replaceProduct(id: string, dto: CreateProductDto) {
    let product = await this.productRepo.findOne({ where: { id } });

    const newProduct = this.productRepo.create({
      id,
      ...dto,
      createdAt: product?.createdAt ?? new Date(),
      updatedAt: new Date(),
    });

    await this.productRepo.save(newProduct);

    return this.ok(newProduct, { message: 'Product replaced' });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) return this.ok(null, { message: 'Not found' });

    Object.assign(product, dto, { updatedAt: new Date() });
    await this.productRepo.save(product);

    return this.ok(product, { message: 'Product updated' });
  }

  async updateStock(id: string, dto: UpdateStockDto) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) return this.ok(null, { message: 'Not found' });

    product.stock = dto.stock;
    product.updatedAt = new Date();

    await this.productRepo.save(product);

    return this.ok(product, { message: 'Stock updated' });
  }

  async removeProduct(id: string) {
    const result = await this.productRepo.delete(id);
    return this.ok({ removed: result.affected });
  }

  async stats(from?: string, to?: string) {
    const total = await this.productRepo.count();
    const inStock = await this.productRepo.count({ where: { stock: 1 } });

    return this.ok({ totalProducts: total, inStock });
  }
}
