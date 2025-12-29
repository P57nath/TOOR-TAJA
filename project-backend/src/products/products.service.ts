import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/seller/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  listAll() {
    return this.productRepository.find({ order: { createdAt: 'DESC' } });
  }

  getById(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }
}
