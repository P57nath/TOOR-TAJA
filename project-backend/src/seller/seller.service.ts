import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DeleteResult } from 'typeorm';

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



  
  async createUser(dto: CreateSellerDto) {
    
    const seller = this.sellerRepo.create(dto);
    await this.sellerRepo.save(seller);

    
    return this.ok(
      {
        id: seller.id,
        username: seller.username,
        fullName: seller.fullName,
        isActive: seller.isActive,
        email: seller.email,
        gender: seller.gender,
        phoneNumber: seller.phoneNumber,
        createdAt: seller.createdAt,
      },
      { message: 'User created successfully' },
    );
  }

  
  async findUsersByFullName(substring: string) {
    const users = await this.sellerRepo.find({
      select: ['id', 'username', 'fullName', 'isActive', 'email', 'createdAt'], 
      where: {
        fullName: Like(`%${substring}%`), 
      },
    });

    return this.ok(users, { message: `Found ${users.length} user(s)` });
  }

  
  async findUserByUsername(username: string) {
    const user = await this.sellerRepo.findOne({
      select: ['id', 'username', 'fullName', 'isActive', 'email', 'createdAt'],
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`); 
    }

    return this.ok(user, { message: 'User found' });
  }

 
  async removeUserByUsername(username: string) {
    const result: DeleteResult = await this.sellerRepo.delete({ username });

    if (result.affected === 0) {
      throw new NotFoundException(`User with username '${username}' not found for deletion`);
    }

    return this.ok(null, { message: `User '${username}' successfully removed` });
  }



  async createProduct(dto: CreateProductDto) {
    
    const finalDto = { ...dto, stock: dto.stock ?? 0 };
    const product = this.productRepo.create(finalDto);
    await this.productRepo.save(product);
    return this.ok(product, { message: 'Product created' });
  }

  async findAllProducts(category?: string) {
    const products = await this.productRepo.find({
      where: category ? { category } : {},
      order: { createdAt: 'DESC' },
    });
    return this.ok(products, { message: `Found ${products.length} products` });
  }

  async findProduct(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return this.ok(product, { message: 'Product found' });
  }

  async replaceProduct(id: string, dto: CreateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

  
    const newProduct = this.productRepo.create({
      id: product.id,
      ...dto,
      createdAt: product.createdAt, 
      updatedAt: new Date(),
    });

    await this.productRepo.save(newProduct);

    return this.ok(newProduct, { message: 'Product replaced' });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    
    Object.assign(product, dto, { updatedAt: new Date() });
    await this.productRepo.save(product);

    return this.ok(product, { message: 'Product updated' });
  }

  async updateStock(id: string, dto: UpdateStockDto) {
    const result = await this.productRepo.update(
      { id },
      { stock: dto.stock, updatedAt: new Date() },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID '${id}' not found to update stock`);
    }

    const updatedProduct = await this.productRepo.findOne({ where: { id } });
    return this.ok(updatedProduct, { message: 'Stock updated' });
  }

  async removeProduct(id: string) {
    const result = await this.productRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID '${id}' not found for deletion`);
    }

    return this.ok(null, { message: `Product ID '${id}' successfully removed` });
  }
}