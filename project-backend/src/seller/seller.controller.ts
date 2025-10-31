import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  // (1) POST /seller/products
  @Post('products')
  create(@Body() dto: CreateProductDto) {
    return this.sellerService.create(dto);
  }

  // (2) GET /seller/products
  @Get('products')
  findAll(@Query('category') category?: string) {
    return this.sellerService.findAll(category);
  }

  // (3) GET /seller/products/:id
  @Get('products/:id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(id);
  }

  // (4) PUT /seller/products/:id
  @Put('products/:id')
  replace(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return this.sellerService.replace(id, dto);
  }

  // (5) PATCH /seller/products/:id
  @Patch('products/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.sellerService.update(id, dto);
  }

  // (6) PATCH /seller/products/:id/stock
  @Patch('products/:id/stock')
  updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.sellerService.updateStock(id, dto);
  }

  // (7) DELETE /seller/products/:id
  @Delete('products/:id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(id);
  }

  // (8) GET /seller/products/stats?from=2025-01-01&to=2025-12-31
  @Get('products/stats')
  stats(@Query('from') from?: string, @Query('to') to?: string) {
    return this.sellerService.stats(from, to);
  }
}
