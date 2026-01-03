import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MailerModuleCustom } from 'src/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { SellerProfile } from './seller-profile.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-items.entity';
import { InventoryModule } from 'src/inventory/inventory.module';
import { StoriesModule } from 'src/stories/stories.module';
import { Category } from 'src/products/category.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([SellerProfile, Product, Order, OrderItem, Category]), 
    InventoryModule,
    StoriesModule,
    MailerModuleCustom,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn as any },
    }),
  ],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
  
})
export class SellerModule {}
