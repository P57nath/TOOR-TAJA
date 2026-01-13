import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/users/user.entity';
import { Category } from 'src/products/category.entity';
import { SubCategory } from 'src/products/subcategory.entity';

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

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', type: 'varchar', nullable: true })
  categoryId?: string | null;

  @ManyToOne(() => SubCategory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory?: SubCategory | null;

  @Column({ name: 'subcategory_id', type: 'varchar', nullable: true })
  subcategoryId?: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAverage: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ nullable: true }) 
  description?: string;

  @Column({ type: 'varchar', default: 'each' })
  unit: string;

  @Column({ name: 'unit_value', type: 'decimal', precision: 8, scale: 2, nullable: true })
  unitValue?: number | null;

  @Column({ name: 'image_path', type: 'varchar', nullable: true })
  imagePath?: string | null;

  @Column() 
  sellerUserId: string;

  @CreateDateColumn() 
  createdAt: Date;

  @UpdateDateColumn() 
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  // Many-to-One relationship with seller user
  @ManyToOne(() => User)
  @JoinColumn({ name: 'sellerUserId' })
  seller: User;
}
