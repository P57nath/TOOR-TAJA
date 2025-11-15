import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';

import { BuyerModule } from './buyer/buyer.module';
import { GuestModule } from './guest/guest.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [AdminModule, SellerModule , BuyerModule, GuestModule,SellerModule,TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mahir12345',
      database: 'mahirDB',//Change to your database name
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
