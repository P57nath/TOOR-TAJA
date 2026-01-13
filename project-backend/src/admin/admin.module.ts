import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModuleCustom } from 'src/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { User } from 'src/users/user.entity';
import { SellerProfile } from 'src/sellers/seller-profile.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Category } from 'src/products/category.entity';
import { Dispute } from 'src/disputes/dispute.entity';
import { StoriesModule } from 'src/stories/stories.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AdminProfile } from './admin-profile.entity';
import { SubCategory } from 'src/products/subcategory.entity';

@Module({
   imports: [TypeOrmModule.forFeature([User, SellerProfile, Order, Category, SubCategory, Dispute, AdminProfile]), StoriesModule, NotificationsModule, MailerModuleCustom, JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: jwtConstants.expiresIn as any },
  })],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
