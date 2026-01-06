import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // Import JWT
import { Seller } from './entities/seller.entity';
import { Product } from './entities/product.entity';
import { SellerProfile } from './entities/seller-profile.entity'; // Import Profile


@Module({
  imports: [
    TypeOrmModule.forFeature([Seller, Product,SellerProfile]), 
    JwtModule.register({
      global: true,
      secret: 'MY_SECRET_KEY', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
  
})
export class SellerModule {}
