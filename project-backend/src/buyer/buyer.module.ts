import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerProfile } from './entities/buyer-profile.entity';
import { Cart, CartItem } from './entities/cart.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-items.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuyerProfile, Cart, Order, OrderItem, CartItem]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn as any },
    }),
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
})
export class BuyerModule {}

