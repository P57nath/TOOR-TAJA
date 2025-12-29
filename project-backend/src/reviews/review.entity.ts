import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryColumn, DeleteDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('reviews')
@Index(['userId', 'orderItemId'], { unique: true })
export class Review {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `r_${uuidv4().split('-')[0]}`;
    }
  }

  @Column()
  userId: string;

  @Column()
  productId: string;

  @Column()
  orderItemId: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
