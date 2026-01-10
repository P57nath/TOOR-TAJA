import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { SellerModule } from './sellers/seller.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerModule } from './buyers/buyer.module';
import { MailerModuleCustom } from './mailer/mailer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DisputesModule } from './disputes/disputes.module';
import { InventoryModule } from './inventory/inventory.module';
import { PaymentsModule } from './payments/payments.module';
import { StoriesModule } from './stories/stories.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    AdminModule,
    SellerModule,
    BuyerModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ReviewsModule,
    DisputesModule,
    InventoryModule,
    PaymentsModule,
    StoriesModule,
    NotificationsModule,
    MailerModuleCustom,
    TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'DBweb012@',// add your database password here
      database: 'toortajabackup',// add your database name here
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
