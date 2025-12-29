import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async list() {
    const products = await this.productsService.listAll();
    return { success: true, data: products, total: products.length };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const product = await this.productsService.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { success: true, data: product };
  }
}
