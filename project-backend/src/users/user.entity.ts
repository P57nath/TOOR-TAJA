import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Role } from 'src/common/enums/role.enum';
import { BuyerProfile } from 'src/buyers/buyer-profile.entity';
import { SellerProfile } from 'src/sellers/seller-profile.entity';
import { AdminProfile } from 'src/admin/admin-profile.entity';

// Central auth identity; role-specific data lives in profile tables.
@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `u_${uuidv4().split('-')[0]}`;
    }
  }

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  // Optional hashed refresh token to support logout/rotation.
  @Column({ name: 'refresh_token_hash', type: 'varchar', nullable: true })
  refreshTokenHash?: string | null;

  @Column({ name: 'password_reset_token_hash', type: 'varchar', nullable: true })
  passwordResetTokenHash?: string | null;

  @Column({
    name: 'password_reset_expires_at',
    type: 'timestamp',
    nullable: true,
  })
  passwordResetExpiresAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @OneToOne(() => BuyerProfile, (profile) => profile.user)
  buyerProfile?: BuyerProfile;

  @OneToOne(() => SellerProfile, (profile) => profile.user)
  sellerProfile?: SellerProfile;

  @OneToOne(() => AdminProfile, (profile) => profile.user)
  adminProfile?: AdminProfile;
}
