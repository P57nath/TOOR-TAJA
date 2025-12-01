import { Injectable, NotFoundException,UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DeleteResult } from 'typeorm';
import * as bcrypt from 'bcrypt'; // BCrypt
import { JwtService } from '@nestjs/jwt'; // JWT
import * as nodemailer from 'nodemailer'; // Mailer

import { Seller } from './entities/seller.entity';
import { Product } from './entities/product.entity';
import { SellerProfile } from './entities/seller-profile.entity'; // New Entity

import { CreateSellerDto } from './dto/create-seller.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateProfileDto } from './dto/create-profile.dto'; // New DTO
import { LoginDto } from './dto/login.dto'; // New DTO

@Injectable()
export class SellerService {
  private transporter;

  constructor(
    @InjectRepository(Seller)
    private sellerRepo: Repository<Seller>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(SellerProfile)
    private profileRepo: Repository<SellerProfile>,

    private jwtService: JwtService,
  ) {
  
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {

        user: process.env.MAIL_USER || '',
        pass: process.env.MAIL_PASS || '',
      },
    });
  }

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
 

  async login(dto: LoginDto) {
    const seller = await this.sellerRepo.findOne({ where: { username: dto.username } });
    if (!seller) throw new UnauthorizedException('Invalid credentials');

    // Compare Password (BCrypt)
    const isMatch = await bcrypt.compare(dto.password, seller.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Generate Token
    const payload = { sub: seller.id, username: seller.username };
    const access_token = await this.jwtService.signAsync(payload, { secret: 'MY_SECRET_KEY', expiresIn: '1h' });

    return this.ok({ access_token }, { message: 'Login successful' });
  }

  async createUser(dto: CreateSellerDto) {
   
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const seller = this.sellerRepo.create({
      ...dto,
      password: hashedPassword, // Save hashed password
    });

    try {
      await this.sellerRepo.save(seller);

      // Send Email (Mailer)
      await this.sendWelcomeEmail(seller.email, seller.fullName);
    } catch (error) {
       throw new BadRequestException('Username or Email already exists');
    }

    return this.ok(
      {
        id: seller.id,
        username: seller.username,
        email: seller.email,
        createdAt: seller.createdAt,
      },
      { message: 'User created successfully' },
    );
  }

  async sendWelcomeEmail(to: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: '"Mahir Email service" <no-reply@shop.com>',
        to: to,
        subject: 'Welcome to Our Platform!',
        text: `Hello ${name}, welcome to our Seller Platform!`,
      });
      console.log(`Email sent to ${to}`);
    } catch (e) {
      console.log('Email failed (Mocking success for development)');
    }
  }

  

  async createOrUpdateProfile(sellerId: string, dto: CreateProfileDto) {
    const seller = await this.sellerRepo.findOne({ 
        where: { id: sellerId },
        relations: ['profile'] 
    });
    
    if (!seller) throw new NotFoundException('Seller not found');

    if (seller.profile) {
        // Update existing
        Object.assign(seller.profile, dto);
        await this.profileRepo.save(seller.profile);
        return this.ok(seller.profile, { message: 'Profile updated' });
    } else {
        // Create new
        const newProfile = this.profileRepo.create(dto);
        newProfile.seller = seller;
        await this.profileRepo.save(newProfile);
        return this.ok(newProfile, { message: 'Profile created' });
    }
  }

  async getProfile(sellerId: string) {
      const seller = await this.sellerRepo.findOne({
          where: { id: sellerId },
          relations: ['profile']
      });
      if(!seller || !seller.profile) throw new NotFoundException('Profile not found');
      return this.ok(seller.profile, { message: 'Profile retrieved' });
  }

  // Get seller with all their products
  async getSellerWithProducts(sellerId: string): Promise<Seller> {
    const seller = await this.sellerRepo.findOne({
      where: { id: sellerId },
      relations: ['products'], // This loads the related products
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${sellerId} not found`);
    }

    return seller;
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