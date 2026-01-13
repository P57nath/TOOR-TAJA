import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Category } from './category.entity';

@Entity('subcategories')
export class SubCategory {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `sub_${uuidv4().split('-')[0]}`;
    }
  }

  @Column({ length: 80 })
  name: string;

  @Column({ name: 'image_path', type: 'varchar', nullable: true })
  imagePath?: string | null;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', type: 'varchar' })
  categoryId: string;
}
