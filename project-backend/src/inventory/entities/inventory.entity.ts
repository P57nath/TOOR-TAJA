import { BeforeInsert, Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('inventories')
export class Inventory {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `inv_${uuidv4().split('-')[0]}`;
    }
  }

  @Column()
  productId: string;

  @Column()
  sellerUserId: string;

  @Column({ type: 'int', default: 0 })
  available: number;

  @Column({ type: 'int', default: 0 })
  reserved: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
