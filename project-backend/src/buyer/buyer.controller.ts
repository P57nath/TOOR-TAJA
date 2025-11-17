import { Body, Controller, DefaultValuePipe, Delete, Get, Header, Param, ParseIntPipe, Patch, Post, Put, Query, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { BuyerProfileDto } from './dto/buyerProfileDtos/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import * as orderEntity from './entities/order.entity';
import { UpdateBuyerStatusDto } from './dto/buyerProfileDtos/update-buyerStatus.dto';
import { GetInactiveBuyersDto } from './dto/buyerProfileDtos/getInactive-buyer.dto';
import { GetBuyersOverAgeDto } from './dto/buyerProfileDtos/getOverage-buyer.dto';

@Controller('buyer')
@UsePipes(new ValidationPipe({ transform: true }))
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) { }

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
    @Query('page', ParseIntPipe)
    @Query('limit', ParseIntPipe) q: OrderQueryDto
  ) {
    return this.buyerService.listOrders(buyerId, q);
  }

  // 10) POST /buyer/:buyerId/documents -> upload document

  @Post(':buyerId/documents')
  @UseInterceptors(
    FileInterceptor('document', {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/i)) {
          return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
        }
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
    }),
  )
  uploadDocument(
    @Param('buyerId') buyerId: string,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.buyerService.uploadDocument(buyerId, dto, file);
  }

  // 11) GET /buyer/:buyerId/documents/:filename -> get document info
  @Get(':buyerId/documents/:filename')
  getDocumentInfo(
    @Param('buyerId') buyerId: string,
    @Param('filename') filename: string,
  ) {
    return this.buyerService.getDocumentInfo(buyerId, filename);
  }
  // 12) GET /buyer/:buyerId/documents/:filename/download -> download document
  @Get(':buyerId/documents/:filename/download')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="document.pdf"')
  downloadDocument(
    @Param('buyerId') buyerId: string,
    @Param('filename') filename: string,
    @Res() res: any,
  ) {
    return this.buyerService.downloadDocument(buyerId, filename, res);
  }

  // 11) PATCH /buyer/:buyerId/status -> change user status (active/inactive)
  @Patch(':buyerId/status')
  updateBuyerStatus(
    @Param('buyerId') buyerId: string,
    @Body() dto: UpdateBuyerStatusDto,
  ) {
    return this.buyerService.updateBuyerStatus(buyerId, dto);
  }

  // 12) GET /buyer/inactive -> retrieve list of inactive users
  @Get('inactive')
  getInactiveBuyers(@Query() query: GetInactiveBuyersDto) {
    return this.buyerService.getInactiveBuyers(query);
  }

  // 13) GET /buyer/older-than-40 -> get list of users older than 40
  @Get('older-than-40')
  getBuyersOver40(@Query() query: GetBuyersOverAgeDto) {
    return this.buyerService.getBuyersOver40(query);
  }

  // 14) GET /buyer/older-than/:age -> get list of users older than specific age
  @Get('older-than/:age')
  getBuyersOverAge(
    @Param('age', ParseIntPipe) age: number,
    @Query() query: GetBuyersOverAgeDto,
  ) {
    return this.buyerService.getBuyersOverAge(age, query);
  }
}
