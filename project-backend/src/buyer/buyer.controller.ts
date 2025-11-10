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


  // 1) Post /buyer -> create buyer
  @Post()
  createBuyer(@Body() dto: BuyerProfileDto) {
    return this.buyerService.createBuyer(dto);
  }
  // 2) PUT /buyer/:buyerId/profile -> replace profile
  @Put(':buyerId/profile')
  replaceProfile(@Param('buyerId') buyerId: string, @Body() dto: BuyerProfileDto) {
    return this.buyerService.replaceProfile(buyerId, dto);
  }
  // 3) POST /buyer/:buyerId/cart/items  -> add to cart
  @Post(':buyerId/cart/items')
  addToCart(@Param('buyerId') buyerId: string, @Body() dto: AddToCartDto) {
    return this.buyerService.addToCart(buyerId, dto);
  }
  // 4) PATCH /buyer/:buyerId/cart/items/:productId -> update quantity
  @Patch(':buyerId/cart/items/:productId')
  updateCartItem(
    @Param('buyerId') buyerId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.buyerService.updateCartItem(buyerId, productId, dto);
  }

  // 5) DELETE /buyer/:buyerId/cart/items/:productId -> remove item
  @Delete(':buyerId/cart/items/:productId')
  removeCartItem(@Param('buyerId') buyerId: string, @Param('productId') productId: string) {
    return this.buyerService.removeCartItem(buyerId, productId);
  }

  // 6) GET /buyer/:buyerId/cart?coupon=SAVE10 -> fetch cart
  @Get(':buyerId/cart')
  getCart(@Param('buyerId') buyerId: string, @Query('coupon') coupon?: string) {
    return this.buyerService.getCart(buyerId, coupon);
  }

  // 7) POST /buyer/orders -> create order
  @Post('orders')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.buyerService.createOrder(dto);
  }

  // 8) GET /buyer/:buyerId/orders/:id -> order detail
  @Get(':buyerId/orders/:id')
  getOrder(@Param('buyerId') buyerId: string, @Param('id') id: string) {
    return this.buyerService.getOrder(buyerId, id);
  }

  // 9) GET /buyer/:buyerId/orders?status=&page=&limit= -> order list
  @Get(':buyerId/orders')
  listOrders(@Param('buyerId') buyerId: string, @Query() q: OrderQueryDto) {
    return this.buyerService.listOrders(buyerId, q);
  }

  
  
}
// Example Requests:
/* 
PUT /buyer/buyer_1/profile

{ "buyerId": "buyer_1", "name": "Ashish", "email": "ashish@example.com", "phone": "555-0199" }

POST /buyer/buyer_1/cart/items

{ "productId": "p1", "name": "Banana", "price": 1.99, "quantity": 3 }


PATCH /buyer/buyer_1/cart/items/p1

{ "quantity": 5 }


DELETE /buyer/buyer_1/cart/items/p1

GET /buyer/buyer_1/cart?coupon=SAVE10

POST /buyer/orders

{
  "buyerId": "buyer_1",
  "addressId": "addr_7",
  "items": [
    { "productId": "p1", "name": "Banana", "price": 1.99, "quantity": 2 },
    { "productId": "p3", "name": "Spinach", "price": 1.49, "quantity": 1 }
  ],
  "note": "Leave at door"
}


GET /buyer/buyer_1/orders/o_123

GET /buyer/buyer_1/orders?status=pending&page=1&limit=10

*/


