import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminProfile } from './entities/admin-profile.entity';


import { BuyerProfile } from 'src/buyer/entities/buyer-profile.entity';
@Module({
   imports: [TypeOrmModule.forFeature([Admin, BuyerProfile])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
