import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerCustomerController } from './buyer-customer.controller';
import { BuyerService } from './buyer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerProfile } from './buyer-profile.entity';
import { Cart, CartItem } from 'src/cart/entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-items.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { Product } from 'src/sellers/entities/product.entity';
import { Review } from 'src/reviews/review.entity';
import { InventoryModule } from 'src/inventory/inventory.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { DisputesModule } from 'src/disputes/disputes.module';
import { StoriesModule } from 'src/stories/stories.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { User } from 'src/users/user.entity';
import { MailerModuleCustom } from 'src/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuyerProfile, Cart, Order, OrderItem, CartItem, Product, Review, User]),
    InventoryModule,
    PaymentsModule,
    DisputesModule,
    StoriesModule,
    NotificationsModule,
    MailerModuleCustom,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn as any },
    }),
  ],
  controllers: [BuyerController, BuyerCustomerController],
  providers: [BuyerService],
})
export class BuyerModule {}

