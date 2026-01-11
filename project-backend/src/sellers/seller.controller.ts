import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { CreateStoryDto } from 'src/stories/dto/create-story.dto';
import { StoriesService } from 'src/stories/stories.service';
import { mkdirSync } from 'fs';

@Controller('seller')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER)
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly storiesService: StoriesService,
  ) {}


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

  @Patch('profile')
  updateProfile(@CurrentUser() user: { id: string }, @Body() dto: UpdateSellerProfileDto) {
    return this.sellerService.updateProfile(user.id, dto);
  }


  // @Post('register')
  // createSeller(@Body() dto: CreateSellerDto) {
  //   return this.sellerService.createUser(dto);
  // }


  @Post('products')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(png|jpe?g|webp)$/i)) {
          return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = './upload/products';
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = file.originalname.split('.').pop();
          cb(null, `${uniqueName}.${ext}`);
        },
      }),
    }),
  )
  createProduct(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.sellerService.createProduct(user.id, dto, file?.filename ?? null);
  }

 
  @Get('products')
  findAllProducts(@CurrentUser() user: { id: string }, @Query('categoryId') categoryId?: string) {
    return this.sellerService.findAllProducts(user.id, categoryId);
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

  @Post('stories')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(png|jpe?g|webp)$/i)) {
          return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = './upload/stories';
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = file.originalname.split('.').pop();
          cb(null, `${uniqueName}.${ext}`);
        },
      }),
    }),
  )
  createStory(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateStoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new MulterError('LIMIT_UNEXPECTED_FILE', 'image');
    }
    return this.storiesService.createStory(user.id, file.filename, dto);
  }
}
