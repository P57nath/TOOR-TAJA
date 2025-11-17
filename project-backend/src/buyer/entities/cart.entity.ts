import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { CartItem } from "./cart-items.entity";

@Entity('carts')
export class Cart {
  @PrimaryColumn()
  buyerId: string;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true, eager: true })
  items: CartItem[];

  @Column({ nullable: true })
  coupon?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to calculate total
  calculateTotal(): number {
    return this.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  }
}
export { CartItem };

