import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/users/user.entity';

export type SellerStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED';

@Entity('seller_profiles')
export class SellerProfile {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateSellerProfileId() {
    if (!this.id) {
      this.id = `s_${uuidv4().split('-')[0]}`;
    }
  }

  @OneToOne(() => User, (user) => user.sellerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'store_name', type: 'varchar', length: 150 })
  storeName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  businessInfo?: string;

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'SUSPENDED'], default: 'PENDING' })
  status: SellerStatus;
}
