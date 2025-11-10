import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { BuyerProfileDto } from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as orderEntity from './entities/order.entity';

@Controller('buyer')
@UsePipes(new ValidationPipe({ transform: true }))
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
  listOrders(
  @Param('buyerId') buyerId: string, 
  // @Query('status') status?: orderEntity.OrderStatus,
  // @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  // @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  @Query('page', ParseIntPipe)
  @Query('limit', ParseIntPipe) q: OrderQueryDto
  )
  {
    //return this.buyerService.listOrders(buyerId, { status, page, limit });
    return this.buyerService.listOrders(buyerId, q);
  }

  // @Get(':buyerId/orders')
  // listOrders(@Param('buyerId') buyerId: string, @Query() q: OrderQueryDto) {
  //   return this.buyerService.listOrders(buyerId, q);
  // }

  // 10) POST /buyer/:buyerId/documents -> upload document
  @Post(':buyerId/documents')
  @UseInterceptors(
  FileInterceptor('document', {
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf)$/i)) {
        return cb(new Error('Only PDF files are allowed!'), false);
      }
        
      // if (file.mimetype !== 'application/pdf') {
      //   return cb(new Error('Invalid file type! Only PDF files are allowed.'), false);
      // }
      
      if (file.size > 5_000_000) {
        return cb(new Error('File size too large! Maximum is 5MB'), false);
      }
      
      cb(null, true);
    },
    storage: diskStorage({
      destination: './upload/buyer-documents',
      filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
        cb(null, uniqueName);
      },
    }),
      limits: {
        fileSize: 5_000_000,
      },
    }),
  )
    uploadDocument(
      @Param('buyerId') buyerId: string,
      @Body() dto: any,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return this.buyerService.uploadDocument(buyerId, dto, file);
    }

  
  
}
/*
=== UPDATED EXAMPLE REQUESTS WITH VALIDATION RULES ===

1. CREATE/UPDATE BUYER PROFILE (POST /buyer OR PUT /buyer/:buyerId/profile)
   URL: PUT /buyer/buyer_1/profile
   BODY:
   {
     "buyerId": "buyer_1",
     "name": "Ashish",                    
     "email": "ashish@example.com",       
     "password": "password123",           
     "phone": "01712345678",             
     "defaultAddressId": "addr_1"        
   }

2. ADD TO CART (POST /buyer/:buyerId/cart/items)
   URL: POST /buyer/buyer_1/cart/items
   BODY:
   {
     "productId": "p1",
     "name": "Banana", 
     "price": 1.99,
     "quantity": 3
   }

3. UPDATE CART ITEM (PATCH /buyer/:buyerId/cart/items/:productId)
   URL: PATCH /buyer/buyer_1/cart/items/p1
   BODY:
   {
     "quantity": 5
   }

4. REMOVE CART ITEM (DELETE /buyer/:buyerId/cart/items/:productId)
   URL: DELETE /buyer/buyer_1/cart/items/p1
   BODY: No body required

5. GET CART WITH COUPON (GET /buyer/:buyerId/cart?coupon=)
   URL: GET /buyer/buyer_1/cart?coupon=SAVE10

6. CREATE ORDER (POST /buyer/orders)
   URL: POST /buyer/orders
   BODY:
   {
     "buyerId": "buyer_1",
     "addressId": "addr_7",
     "items": [
       { 
         "productId": "p1", 
         "name": "Banana", 
         "price": 1.99, 
         "quantity": 2 
       },
       { 
         "productId": "p3", 
         "name": "Spinach", 
         "price": 1.49, 
         "quantity": 1 
       }
     ],
     "note": "Leave at door"
   }

7. GET ORDER DETAILS (GET /buyer/:buyerId/orders/:id)
   URL: GET /buyer/buyer_1/orders/o_123

8. LIST ORDERS WITH FILTERS (GET /buyer/:buyerId/orders?status=&page=&limit=)
   URL: GET /buyer/buyer_1/orders?status=pending&page=1&limit=10
   NOTE: page and limit are auto-transformed to numbers

=== VALIDATION RULES SUMMARY ===

NAME FIELD:
  - Rule: Only letters (a-z, A-Z) and spaces
  - Valid: "John Doe", "Mary", "Ashish Kumar"
  - Invalid: "John123", "Mary@Smith", "Bob_Doe"

PHONE FIELD:
  - Rule: Must start with "01" and be exactly 11 digits
  - Valid: "01712345678", "01876543210" 
  - Invalid: "1234567890", "02782641610", "017826416", "017826416101"

PASSWORD FIELD:
  - Rule: Minimum 6 characters + at least 1 lowercase letter
  - Valid: "password123", "helloWorld", "test123"
  - Invalid: "PASSWORD", "123456", "HELLO", "abc12"

EMAIL FIELD:
  - Rule: Standard email format validation
  - Valid: "user@example.com", "test@gmail.com"
  - Invalid: "invalid-email", "user@.com", "@example.com"

=== INVALID REQUEST EXAMPLES (WILL BE REJECTED) ===

INVALID NAME (contains numbers):
{
  "name": "Ashish123",
  "email": "ashish@example.com",
  "password": "password123",
  "phone": "01782641610"
}

INVALID NAME (contains special characters):
{
  "name": "Ashish@Kumar",
  "email": "ashish@example.com", 
  "password": "password123",
  "phone": "01782641610"
}

INVALID PHONE (wrong prefix):
{
  "name": "Ashish",
  "email": "ashish@example.com",
  "password": "password123",
  "phone": "02782641610"
}

INVALID PHONE (wrong length):
{
  "name": "Ashish",
  "email": "ashish@example.com",
  "password": "password123",
  "phone": "017826416"
}

INVALID PASSWORD (no lowercase):
{
  "name": "Ashish",
  "email": "ashish@example.com",
  "password": "PASSWORD123",
  "phone": "01782641610"
}

INVALID PASSWORD (too short):
{
  "name": "Ashish",
  "email": "ashish@example.com",
  "password": "abc12",
  "phone": "01782641610"
}
*/