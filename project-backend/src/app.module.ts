import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { GuestModule } from './guest/guest.module';

@Module({
  imports: [AdminModule, SellerModule, BuyerModule, GuestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
