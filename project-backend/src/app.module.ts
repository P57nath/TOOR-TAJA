import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { GuestModule } from './guest/guest.module';
import { Admin2Module } from './admin2/admin2.module';

@Module({
  imports: [AdminModule, SellerModule, BuyerModule, GuestModule, Admin2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
