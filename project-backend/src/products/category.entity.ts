import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, DeleteDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('categories')
export class Category {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `cat_${uuidv4().split('-')[0]}`;
    }
  }

  @Column({ unique: true, length: 80 })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
