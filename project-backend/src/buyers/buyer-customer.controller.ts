import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AddToCartDto } from 'src/cart/dto/add-to-cart.dto';
import { UpdateCartItemDto } from 'src/cart/dto/update-cart-item.dto';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { CreateDisputeDto } from 'src/disputes/dto/create-dispute.dto';
import { DisputesService } from 'src/disputes/disputes.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BUYER)
export class BuyerCustomerController {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly disputesService: DisputesService,
  ) {}

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

  @Post('disputes')
  createDispute(@CurrentUser() user: { id: string }, @Body() dto: CreateDisputeDto) {
    return this.disputesService.createDispute(user.id, dto.orderId, dto.reason);
  }
}
