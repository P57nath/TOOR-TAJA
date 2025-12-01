import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminProfile } from './entities/admin-profile.entity';


import { BuyerProfile } from 'src/buyer/entities/buyer-profile.entity';
import { AdminProfileController } from './admin-profile.controller';
import { AdminProfileService } from './admin-profile.service';
@Module({
   imports: [TypeOrmModule.forFeature([Admin, BuyerProfile,AdminProfile,AdminProfile])],
  controllers: [AdminController,AdminProfileController],
  providers: [AdminService, AdminProfileService],
  exports: [AdminService],
})
export class AdminModule {}
