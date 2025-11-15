import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, Index } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

@Entity('orders')
export class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  @Index()
  buyerId: string;

  @Column('json')
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
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

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `ord_${uuidv4().split('-')[0]}`; //ord_550e8400
    }
  }
  calculateTotal(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updateStatus(newStatus: OrderStatus) {
    this.status = newStatus;
    const now = new Date();
    
    switch (newStatus) {
      case 'paid':
        this.paidAt = now;
        break;
      case 'shipped':
        this.shippedAt = now;
        break;
      case 'delivered':
        this.deliveredAt = now;
        break;
      case 'cancelled':
        this.cancelledAt = now;
        break;
    }
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}

export class OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sku?: string;
}