import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { Product } from 'src/sellers/entities/product.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getOrCreate(productId: string, sellerUserId: string) {
    let inventory = await this.inventoryRepository.findOne({ where: { productId } });
    if (!inventory) {
      const product = await this.productRepository.findOne({ where: { id: productId, sellerUserId } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      inventory = this.inventoryRepository.create({
        productId,
        sellerUserId,
        available: product.stock ?? 0,
        reserved: 0,
      });
      inventory = await this.inventoryRepository.save(inventory);
    }
    return inventory;
  }

  async reserve(productId: string, sellerUserId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be positive');
    }
    const inventory = await this.getOrCreate(productId, sellerUserId);
    if (inventory.available < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    inventory.available -= quantity;
    inventory.reserved += quantity;
    return this.inventoryRepository.save(inventory);
  }

  async setStock(productId: string, sellerUserId: string, stock: number) {
    const inventory = await this.getOrCreate(productId, sellerUserId);
    inventory.available = stock;
    inventory.reserved = 0;
    return this.inventoryRepository.save(inventory);
  }

  async commitReservation(productId: string, quantity: number) {
    const inventory = await this.inventoryRepository.findOne({ where: { productId } });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    if (inventory.reserved < quantity) {
      throw new BadRequestException('Reserved stock insufficient');
    }
    inventory.reserved -= quantity;
    return this.inventoryRepository.save(inventory);
  }

  async releaseReservation(productId: string, quantity: number) {
    const inventory = await this.inventoryRepository.findOne({ where: { productId } });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    if (inventory.reserved < quantity) {
      throw new BadRequestException('Reserved stock insufficient');
    }
    inventory.reserved -= quantity;
    inventory.available += quantity;
    return this.inventoryRepository.save(inventory);
  }
}
