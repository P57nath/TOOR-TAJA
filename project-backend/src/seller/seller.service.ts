import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class SellerService {
  private products: Product[] = [];

  private ok(data: any, extra: Record<string, any> = {}) {
    return { success: true, ...extra, data };
  }

  create(dto: CreateProductDto) {
    const product: Product = {
      id: 'p_' + Date.now(),
      name: dto.name,
      price: dto.price,
      category: dto.category,
      description: dto.description,
      stock: dto.stock ?? 0,
      sellerId: 'seller_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(product);
    return this.ok(product, { message: 'Product created' });
  }

  findAll(category?: string) {
    const data = category ? this.products.filter(p => p.category === category) : this.products;
    return this.ok(data, { count: data.length });
  }

  findOne(id: string) {
    return this.ok(this.products.find(p => p.id === id) ?? null);
  }

  replace(id: string, dto: CreateProductDto) {
    const idx = this.products.findIndex(p => p.id === id);
    const product: Product = {
      id,
      ...dto,
      stock: dto.stock ?? 0,
      sellerId: 'seller_1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (idx >= 0) this.products[idx] = product; else this.products.push(product);
    return this.ok(product, { message: 'Product replaced' });
  }

  update(id: string, dto: UpdateProductDto) {
    const product = this.products.find(p => p.id === id);
    if (!product) return this.ok(null, { message: 'Not found' });
    Object.assign(product, dto, { updatedAt: new Date() });
    return this.ok(product, { message: 'Product updated' });
  }

  updateStock(id: string, dto: UpdateStockDto) {
    const product = this.products.find(p => p.id === id);
    if (!product) return this.ok(null, { message: 'Not found' });
    product.stock = dto.stock;
    product.updatedAt = new Date();
    return this.ok(product, { message: 'Stock updated' });
  }

  remove(id: string) {
    const before = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.ok({ removed: before - this.products.length });
  }

  stats(from?: string, to?: string) {
    const total = this.products.length;
    const inStock = this.products.filter(p => p.stock > 0).length;
    return this.ok({ totalProducts: total, inStock });
  }
}
