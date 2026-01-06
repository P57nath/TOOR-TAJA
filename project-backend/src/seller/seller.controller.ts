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
  UseGuards, // Import Guard
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProfileDto } from './dto/create-profile.dto'; // New DTO
import { LoginDto } from './dto/login.dto'; // New DTO
import { UpdateStockDto } from './dto/update-stock.dto';
import { Seller } from './entities/seller.entity';
import { AuthGuard } from './auth.guard'; // Import your custom guard

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}


 

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() dto: LoginDto) {
    return this.sellerService.login(dto);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  createSeller(@Body() dto: CreateSellerDto) {
    return this.sellerService.createUser(dto);
  }


  @Post(':id/profile')
  @UseGuards(AuthGuard) 
  createProfile(@Param('id') id: string, @Body() dto: CreateProfileDto) {
      return this.sellerService.createOrUpdateProfile(id, dto);
  }

  @Get(':id/profile')
  @UseGuards(AuthGuard)
  getProfile(@Param('id') id: string) {
      return this.sellerService.getProfile(id);
  }


  // GET /sellers/:sellerId/with-products - Get seller with all their products
  @Get(':sellerId/with-products')
  
  async getSellerWithProducts(
    @Param('sellerId') sellerId: string
  ): Promise<Seller> {
    return this.sellerService.getSellerWithProducts(sellerId);
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
  @UseGuards(AuthGuard) // Protected route
  createProduct(@Body() dto: CreateProductDto) {
    return this.sellerService.createProduct(dto);
  }

  
@Get('products/seller/:sellerId')
findAllProductsBySellerId(@Param('sellerId') sellerId: string) {
  return this.sellerService.findAllProductsBySellerId(sellerId);
}


@Get('products/:productId/seller')
findSellerByProductId(@Param('productId') productId: string) {
  return this.sellerService.findSellerByProductId(productId);
}


 
  @Get('products')
 
  findAllProducts(@Query('category') category?: string) {
    return this.sellerService.findAllProducts(category);
  }

  
  @Get('products/:id')
  @UseGuards(AuthGuard) // Protected route
  findOneProduct(@Param('id') id: string) {
    return this.sellerService.findProduct(id);
  }

  
  @Put('products/:id')
  @UseGuards(AuthGuard) // Protected route
  replaceProduct(@Param('id') id: string, @Body() dto: CreateProductDto) {
    return this.sellerService.replaceProduct(id, dto);
  }


  @Patch('products/:id')
  @UseGuards(AuthGuard) // Protected route
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.sellerService.updateProduct(id, dto);
  }


  @Patch('products/:id/stock')
  @UseGuards(AuthGuard) // Protected route
  updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.sellerService.updateStock(id, dto);
  }

 
  @Delete('products/:id')
  @UseGuards(AuthGuard) // Protected route
  removeProduct(@Param('id') id: string) {
    return this.sellerService.removeProduct(id);
  }
}