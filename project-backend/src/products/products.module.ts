import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from 'src/sellers/entities/product.entity';
import { Category } from './category.entity';
import { SubCategory } from './subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, SubCategory])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
