import {
  Body, Controller, Delete, UsePipes, Get, Param, Patch, Post, Query,
  ValidationPipe,
  UseGuards,
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
