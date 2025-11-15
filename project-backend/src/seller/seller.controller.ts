import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  // -------------------------
  // SELLER OPERATIONS
  // -------------------------

  // (1) Create a Seller
  @Post('register')
  createSeller(@Body() dto: CreateSellerDto) {
    return this.sellerService.createUser(dto);
  }

  // (2) Retrieve users whose full name contains substring
  @Get('search')
  searchByName(@Query('name') name: string) {
    return this.sellerService.findUsersByFullName(name);
  }

  // (3) Retrieve a seller by username
  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.sellerService.findUserByUsername(username);
  }

  // (4) Delete seller based on username
  @Delete(':username')
  removeSeller(@Param('username') username: string) {
    return this.sellerService.removeUserByUsername(username);
  }

  // -------------------------
  // PRODUCT OPERATIONS
  // -------------------------

  // Create a product
  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.sellerService.createProduct(dto);
  }

  // Get all products (filter optional)
  @Get('products')
  findAllProducts(@Query('category') category?: string) {
    return this.sellerService.findAllProducts(category);
  }

  // Get product by ID
  @Get('products/:id')
  findOneProduct(@Param('id') id: string) {
    return this.sellerService.findProduct(id);
  }

  // Replace product
  @Put('products/:id')
  replaceProduct(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return this.sellerService.replaceProduct(id, dto);
  }

  // Update product
  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.sellerService.updateProduct(id, dto);
  }

  // Update stock only
  @Patch('products/:id/stock')
  updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.sellerService.updateStock(id, dto);
  }

  // Delete product
  @Delete('products/:id')
  removeProduct(@Param('id') id: string) {
    return this.sellerService.removeProduct(id);
  }

  // Stats
  @Get('products/stats')
  stats(@Query('from') from?: string, @Query('to') to?: string) {
    return this.sellerService.stats(from, to);
  }
}
