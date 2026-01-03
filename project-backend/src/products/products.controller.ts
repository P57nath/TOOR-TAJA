import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('categories')
  async listCategories() {
    const categories = await this.productsService.listCategories();
    return { success: true, data: categories, total: categories.length };
  }

  @Get()
  async list() {
    const products = await this.productsService.listAll();
    return { success: true, data: products, total: products.length };
  }

  @Get('image/:filename')
  getProductImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = join(process.cwd(), 'upload', 'products', filename);
    if (!existsSync(imagePath)) {
      throw new NotFoundException('Product image not found');
    }
    return res.sendFile(imagePath);
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
