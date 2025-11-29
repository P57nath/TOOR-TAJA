import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerModule } from './buyer/buyer.module';
import { GuestModule } from './guest/guest.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AdminModule, SellerModule , BuyerModule, GuestModule,SellerModule,TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',// add your database password here
      database: '',// add your database name here
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
