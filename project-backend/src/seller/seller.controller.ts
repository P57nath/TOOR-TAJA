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


  @Post('register')
  createSeller(@Body() dto: CreateSellerDto) {
    return this.sellerService.createUser(dto);
  }


  @Get('search')
  searchByName(@Query('name') name: string) {
    return this.sellerService.findUsersByFullName(name);
  }


  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.sellerService.findUserByUsername(username);
  }


  @Delete(':username')
  removeByUsername(@Param('username') username: string) {
    return this.sellerService.removeUserByUsername(username);
  }


  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.sellerService.createProduct(dto);
  }

 
  @Get('products')
  findAllProducts(@Query('category') category?: string) {
    return this.sellerService.findAllProducts(category);
  }

  
  @Get('products/:id')
  findOneProduct(@Param('id') id: string) {
    return this.sellerService.findProduct(id);
  }

  
  @Put('products/:id')
  replaceProduct(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return this.sellerService.replaceProduct(id, dto);
  }


  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.sellerService.updateProduct(id, dto);
  }


  @Patch('products/:id/stock')
  updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.sellerService.updateStock(id, dto);
  }

 
  @Delete('products/:id')
  removeProduct(@Param('id') id: string) {
    return this.sellerService.removeProduct(id);
  }
}