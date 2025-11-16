import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('products') 
export class Product {
  @PrimaryColumn() 
  id: string;

  @BeforeInsert() 
  generateProductId() {
    if (!this.id) {
      const uuid = uuidv4().split('-')[0];
      this.id = `p_${uuid}`; 
    }
  }

  @Column({ length: 100 }) 
  name: string;

  @Column({ type: 'numeric' }) 
  price: number;

  @Column() 
  stock: number;

  @Column({ length: 50 }) 
  category: string;

  @Column({ nullable: true }) 
  description?: string;

  @Column() 
  sellerId: string;

  @CreateDateColumn() 
  createdAt: Date;

  @UpdateDateColumn() 
  updatedAt: Date;
}