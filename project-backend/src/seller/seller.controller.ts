import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('seller')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}


  // GET /seller/me/with-products - Get seller with all their products
  @Get('me/with-products')
  async getSellerWithProducts(@CurrentUser() user: { id: string }) {
    return this.sellerService.getSellerWithProducts(user.id);
  }

  @Post('profile')
  createProfile(@CurrentUser() user: { id: string }, @Body() dto: CreateSellerProfileDto) {
    return this.sellerService.createProfile(user.id, dto);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: { id: string }) {
    return this.sellerService.getProfile(user.id);
  }


  // @Post('register')
  // createSeller(@Body() dto: CreateSellerDto) {
  //   return this.sellerService.createUser(dto);
  // }


  @Post('products')
  createProduct(@CurrentUser() user: { id: string }, @Body() dto: CreateProductDto) {
    return this.sellerService.createProduct(user.id, dto);
  }

 
  @Get('products')
  findAllProducts(@CurrentUser() user: { id: string }, @Query('category') category?: string) {
    return this.sellerService.findAllProducts(user.id, category);
  }

  
  @Get('products/:id')
  findOneProduct(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.sellerService.findProduct(user.id, id);
  }

  
  @Patch('products/:id')
  updateProduct(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.sellerService.updateProduct(user.id, id, dto);
  }


  @Delete('products/:id')
  removeProduct(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.sellerService.removeProduct(user.id, id);
  }

  @Post('inventory')
  createInventory(@CurrentUser() user: { id: string }, @Body() dto: CreateInventoryDto) {
    return this.sellerService.createInventory(user.id, dto);
  }

  @Patch('inventory/:productId')
  updateInventory(
    @CurrentUser() user: { id: string },
    @Param('productId') productId: string,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.sellerService.updateInventory(user.id, productId, dto.stock);
  }

  @Get('orders')
  listOrders(@CurrentUser() user: { id: string }) {
    return this.sellerService.listOrders(user.id);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.sellerService.updateOrderStatus(user.id, id, dto.status);
  }
}
