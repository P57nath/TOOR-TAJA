import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/sellers/entities/product.entity';
import { Category } from './category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  listAll() {
    return this.productRepository.find({
      where: { category: { isActive: true } },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  getById(id: string) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  listCategories() {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}
