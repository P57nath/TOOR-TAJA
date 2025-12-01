import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Product } from './entities/product.entity';
import { MailerModuleCustom } from 'src/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';


@Module({
  imports: [
    TypeOrmModule.forFeature([Seller, Product]), 
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
