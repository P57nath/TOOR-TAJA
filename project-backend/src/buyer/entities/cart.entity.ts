import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('carts')
export class Cart {
  @PrimaryColumn()
  buyerId: string;

  @Column('json')
  items: CartItem[];

  @Column({ nullable: true })
  coupon?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export class CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}