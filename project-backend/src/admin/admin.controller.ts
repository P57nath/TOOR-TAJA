import {
  Body, Controller, Delete, UsePipes, Get, Param, Patch, Post, Query,
  ValidationPipe,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { StoriesService } from 'src/stories/stories.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { mkdirSync } from 'fs';


@Controller('admin')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly storiesService: StoriesService,
  ) { }

  // Admin dashboard summary
  @Get('dashboard')
  dashboard() {
    return this.adminService.dashboard();
  }

  // List sellers with optional status filter
  @Get('sellers')
  listSellers(@Query('status') status?: string) {
    return this.adminService.listSellers(status);
  }

  @Patch('sellers/:id/approve')
  approveSeller(@Param('id') id: string) {
    return this.adminService.approveSeller(id);
  }

  @Patch('sellers/:id/suspend')
  suspendSeller(@Param('id') id: string) {
    return this.adminService.suspendSeller(id);
  }

  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.adminService.createCategory(dto);
  }

  @Get('categories')
  listCategories() {
    return this.adminService.listCategories();
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  @Get('categories/:id/subcategories')
  listSubcategories(@Param('id') id: string) {
    return this.adminService.listSubcategories(id);
  }

  @Post('categories/:id/subcategories')
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
          const dir = './upload/subcategories';
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
  createSubcategory(
    @Param('id') id: string,
    @Body() dto: CreateSubCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.adminService.createSubcategory(id, dto, file?.filename ?? null);
  }

  @Delete('subcategories/:id')
  deleteSubcategory(@Param('id') id: string) {
    return this.adminService.deleteSubcategory(id);
  }

  @Get('orders')
  listOrders() {
    return this.adminService.listOrders();
  }

  @Get('profile')
  getProfile(@CurrentUser() user: { id: string }) {
    return this.adminService.getProfile(user.id);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateAdminProfileDto,
  ) {
    return this.adminService.updateProfile(user.id, dto);
  }

  @Get('disputes')
  listDisputes() {
    return this.adminService.listDisputes();
  }

  @Patch('disputes/:id/resolve')
  resolveDispute(@Param('id') id: string, @Body('resolutionNote') resolutionNote?: string) {
    return this.adminService.resolveDispute(id, resolutionNote);
  }

  @Get('stories')
  listStories(@Query('status') status?: string) {
    return this.storiesService.listStoriesByStatus(status);
  }

  @Patch('stories/:id/approve')
  approveStory(@Param('id') id: string) {
    return this.storiesService.approveStory(id);
  }
}
