import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerProfile } from 'src/buyer/entities/buyer-profile.entity';
import { Seller } from 'src/seller/entities/seller.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { jwtConstants } from './constants';
import { MailerModuleCustom } from 'src/mailer/mailer.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn as any },
    }),
    TypeOrmModule.forFeature([BuyerProfile, Seller, Admin]),
    MailerModuleCustom,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
