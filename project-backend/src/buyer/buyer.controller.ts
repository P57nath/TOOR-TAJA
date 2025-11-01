import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { BuyerProfileDto } from './dto/profile.dto';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  // 1) POST /buyer/:buyerId/cart/items  -> add to cart
  @Post(':buyerId/cart/items')
  addToCart(@Param('buyerId') buyerId: string, @Body() dto: AddToCartDto) {
    return this.buyerService.addToCart(buyerId, dto);
  }

  // 2) PATCH /buyer/:buyerId/cart/items/:productId -> update quantity
  @Patch(':buyerId/cart/items/:productId')
  updateCartItem(
    @Param('buyerId') buyerId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.buyerService.updateCartItem(buyerId, productId, dto);
  }

  // 3) DELETE /buyer/:buyerId/cart/items/:productId -> remove item
  @Delete(':buyerId/cart/items/:productId')
  removeCartItem(@Param('buyerId') buyerId: string, @Param('productId') productId: string) {
    return this.buyerService.removeCartItem(buyerId, productId);
  }

  // 4) GET /buyer/:buyerId/cart?coupon=SAVE10 -> fetch cart
  @Get(':buyerId/cart')
  getCart(@Param('buyerId') buyerId: string, @Query('coupon') coupon?: string) {
    return this.buyerService.getCart(buyerId, coupon);
  }

  // 5) POST /buyer/orders -> create order
  @Post('orders')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.buyerService.createOrder(dto);
  }

  // 6) GET /buyer/:buyerId/orders/:id -> order detail
  @Get(':buyerId/orders/:id')
  getOrder(@Param('buyerId') buyerId: string, @Param('id') id: string) {
    return this.buyerService.getOrder(buyerId, id);
  }

  // 7) GET /buyer/:buyerId/orders?status=&page=&limit= -> order list
  @Get(':buyerId/orders')
  listOrders(@Param('buyerId') buyerId: string, @Query() q: OrderQueryDto) {
    return this.buyerService.listOrders(buyerId, q);
  }

  // 8) PUT /buyer/:buyerId/profile -> replace profile
  @Put(':buyerId/profile')
  replaceProfile(@Param('buyerId') buyerId: string, @Body() dto: BuyerProfileDto) {
    return this.buyerService.replaceProfile(buyerId, dto);
  }
}