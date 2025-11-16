import { Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Product } from './entities/product.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Seller, Product]), 
  ],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
  
})
export class SellerModule {}
