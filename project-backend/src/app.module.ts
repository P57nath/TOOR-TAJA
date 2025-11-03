import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { GuestModule } from './guest/guest.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AdminModule, SellerModule, BuyerModule, GuestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
