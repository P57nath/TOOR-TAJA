import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerCustomerController } from './buyer-customer.controller';
import { BuyerService } from './buyer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerProfile } from './buyer-profile.entity';
import { Cart, CartItem } from './entities/cart.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-items.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { Product } from 'src/seller/entities/product.entity';
import { Review } from 'src/products/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuyerProfile, Cart, Order, OrderItem, CartItem, Product, Review]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn as any },
    }),
  ],
  controllers: [BuyerController, BuyerCustomerController],
  providers: [BuyerService],
})
export class BuyerModule {}

