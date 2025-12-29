import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  exports: [TypeOrmModule],
})
export class CartModule {}
