import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Patch, Post, Put, Query, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { AddToCartDto } from 'src/cart/dto/add-to-cart.dto';
import { UpdateCartItemDto } from 'src/cart/dto/update-cart-item.dto';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrderQueryDto } from 'src/orders/dto/order-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { UpdateBuyerStatusDto } from './dto/buyerProfileDtos/update-buyerStatus.dto';
import { GetInactiveBuyersDto } from './dto/buyerProfileDtos/getInactive-buyer.dto';
import { GetBuyersOverAgeDto } from './dto/buyerProfileDtos/getOverage-buyer.dto';
import { UpdateBuyerDto } from './dto/buyerProfileDtos/update-buyer.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { StoriesService } from 'src/stories/stories.service';

@Controller('buyer')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BUYER)
export class BuyerController {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly storiesService: StoriesService,
  ) { }

  // // Post /buyer -> create buyer

  // @Post()
  // createBuyer(@Body() dto: BuyerProfileDto) {
  //   return this.buyerService.createBuyer(dto);
  // }
  //GET -> get all profiles
  @Get()
  getAllBuyerProfiles() {
    return this.buyerService.getAllBuyerProfiles();
  }
  // PUT /buyer/profile -> update profile

  @Put('profile')
  replaceProfile(@CurrentUser() user: { id: string }, @Body() dto: UpdateBuyerDto) {
    return this.buyerService.replaceProfile(user.id, dto);
  }

  // PATCH /buyer/status -> change user status (active/inactive)
  @Patch('status')
  updateBuyerStatus(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateBuyerStatusDto,
  ) {
    return this.buyerService.updateBuyerStatus(user.id, dto);
  }

  // GET /buyer/inactive -> retrieve list of inactive users
  @Get('inactive')
  getInactiveBuyers(@Query() query: GetInactiveBuyersDto) {
    return this.buyerService.getInactiveBuyers(query);
  }

  // GET /buyer/older-than-40 -> get list of users older than 40
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

  // 3) POST /buyer/cart/items  -> add to cart

  @Post('cart/items')
  addToCart(@CurrentUser() user: { id: string }, @Body() dto: AddToCartDto) {
    return this.buyerService.addToCart(user.id, dto);
  }
  // 4) PATCH /buyer/cart/items/:productId -> update quantity

  @Patch('cart/items/:itemId')
  updateCartItem(
    @CurrentUser() user: { id: string },
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.buyerService.updateCartItem(user.id, itemId, dto);
  }
  // 5) DELETE /buyer/cart/items/:productId -> remove item

  @Delete('cart/items/:itemId')
  removeCartItem(@CurrentUser() user: { id: string }, @Param('itemId', ParseIntPipe) itemId: number) {
    return this.buyerService.removeCartItem(user.id, itemId);
  }

  // 6) GET /buyer/cart?coupon=SAVE10 -> fetch cart
  @Get('cart')
  getCart(@CurrentUser() user: { id: string }, @Query('coupon') coupon?: string) {
    return this.buyerService.getCart(user.id, coupon);
  }

  // 7) POST /buyer/orders -> create order

  @Post('orders')
  createOrder(@CurrentUser() user: { id: string }, @Body() dto: CreateOrderDto) {
    return this.buyerService.createOrder(user.id, dto);
  }


  

  // 10) POST /buyer/documents -> upload document

  @Post('documents')
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
    @CurrentUser() user: { id: string },
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.buyerService.uploadDocument(user.id, dto, file);
  }

  // 11) GET /buyer/documents/:filename -> get document info
  @Get('documents/:filename')
  getDocumentInfo(
    @CurrentUser() user: { id: string },
    @Param('filename') filename: string,
  ) {
    return this.buyerService.getDocumentInfo(user.id, filename);
  }
  // 12) GET /buyer/documents/:filename/download -> download document
  @Get('documents/:filename/download')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="document.pdf"')
  downloadDocument(
    @CurrentUser() user: { id: string },
    @Param('filename') filename: string,
    @Res() res: any,
  ) {
    return this.buyerService.downloadDocument(user.id, filename, res);
  }


  // 9) GET /buyer/orders?status=&page=&limit= -> order list


  // 8) GET /buyer/orders/:id -> order detail

  @Get('orders/:id')
  getOrder(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.buyerService.getOrder(user.id, id);
  }



  @Get('orders')
  listOrders(
    @CurrentUser() user: { id: string },
    @Query('page', ParseIntPipe)
    @Query('limit', ParseIntPipe) q: OrderQueryDto
  ) {
    return this.buyerService.listOrders(user.id, q);
  }

  @Get('stories')
  listStories() {
    return this.storiesService.listApprovedStories();
  }

  @Get(':orderId/buyer-orders')
  listBuyers(
    @Param('orderId') orderId: string,
  ){
    return this.buyerService.listBuyers(orderId);
  }



  

  
}
