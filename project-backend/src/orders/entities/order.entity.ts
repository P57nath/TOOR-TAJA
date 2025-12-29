import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, Index, OneToMany, DeleteDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from "./order-items.entity";

export type OrderStatus = 'CREATED' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

@Entity('orders')
export class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  @Index()
  userId: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true, eager: true })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: ['CREATED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'CREATED'
  })
  @Index()
  status: OrderStatus;

  @Column({ nullable: true })
  addressId?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `ord_${uuidv4().split('-')[0]}`;
    }
  }

  calculateTotal(): number {
    return this.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  }

  updateStatus(newStatus: OrderStatus) {
    this.status = newStatus;
    const now = new Date();
    
    switch (newStatus) {
      case 'PAID':
        this.paidAt = now;
        break;
      case 'SHIPPED':
        this.shippedAt = now;
        break;
      case 'DELIVERED':
        this.deliveredAt = now;
        break;
      case 'CANCELLED':
        this.cancelledAt = now;
        break;
    }
  }

  getItemCount(): number {
    return this.items?.reduce((count, item) => count + item.quantity, 0) || 0;
  }
}
