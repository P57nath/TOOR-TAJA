import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AdminProfileService } from './admin-profile.service';
import { CreateAdminProfileDto } from './dto/create-admin-profile.dto';


@Controller('admin/profile')
export class AdminProfileController {
  constructor(private readonly profileService: AdminProfileService) {}

  @Post(':adminId')
  createProfile(
    @Param('adminId') adminId: string,
    @Body() dto: CreateAdminProfileDto,
  ) {
    return this.profileService.createProfile(adminId, dto);
  }

  @Get(':adminId')
  getProfile(@Param('adminId') adminId: string) {
    return this.profileService.getProfile(adminId);
  }
}
