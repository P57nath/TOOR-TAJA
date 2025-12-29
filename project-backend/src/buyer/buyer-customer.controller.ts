import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BUYER)
export class BuyerCustomerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post('cart')
  addToCart(@CurrentUser() user: { id: string }, @Body() dto: AddToCartDto) {
    return this.buyerService.addToCart(user.id, dto);
  }

  @Patch('cart/items/:id')
  updateCartItem(
    @CurrentUser() user: { id: string },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.buyerService.updateCartItem(user.id, id, dto);
  }

  @Delete('cart/items/:id')
  removeCartItem(@CurrentUser() user: { id: string }, @Param('id', ParseIntPipe) id: number) {
    return this.buyerService.removeCartItem(user.id, id);
  }

  @Post('orders')
  createOrder(@CurrentUser() user: { id: string }, @Body() dto: CreateOrderDto) {
    return this.buyerService.createOrder(user.id, dto);
  }

  @Get('orders/my')
  listMyOrders(@CurrentUser() user: { id: string }) {
    return this.buyerService.listMyOrders(user.id);
  }

  @Post('reviews')
  createReview(@CurrentUser() user: { id: string }, @Body() dto: CreateReviewDto) {
    return this.buyerService.createReview(user.id, dto);
  }
}
