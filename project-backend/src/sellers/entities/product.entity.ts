import {Entity,PrimaryColumn,Column,CreateDateColumn,UpdateDateColumn,BeforeInsert,ManyToOne,JoinColumn,DeleteDateColumn,} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/users/user.entity';

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

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAverage: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ nullable: true }) 
  description?: string;

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
