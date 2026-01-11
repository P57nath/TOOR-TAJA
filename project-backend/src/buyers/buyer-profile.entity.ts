import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/users/user.entity';

@Entity('buyer_profiles')
export class BuyerProfile {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateBuyerProfileId() {
    if (!this.id) {
      this.id = `b_${uuidv4().split('-')[0]}`;
    }
  }

  @OneToOne(() => User, (user) => user.buyerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive' = 'active';

  @Column({ name: 'default_address_id', nullable: true })
  defaultAddressId?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
