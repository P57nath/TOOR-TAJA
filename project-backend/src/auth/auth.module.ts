import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerProfile } from 'src/buyers/buyer-profile.entity';
import { SellerProfile } from 'src/sellers/seller-profile.entity';
import { AdminProfile } from 'src/admin/admin-profile.entity';
import { User } from 'src/users/user.entity';
import { jwtConstants } from './constants';
import { MailerModuleCustom } from 'src/mailer/mailer.module';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn as any },
    }),
    TypeOrmModule.forFeature([User, BuyerProfile, SellerProfile, AdminProfile]),
    MailerModuleCustom,
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
