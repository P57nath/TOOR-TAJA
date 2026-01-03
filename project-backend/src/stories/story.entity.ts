import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SellerProfile } from 'src/sellers/seller-profile.entity';

@Entity('stories')
export class Story {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `st_${uuidv4().split('-')[0]}`;
    }
  }

  @ManyToOne(() => SellerProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_profile_id' })
  sellerProfile: SellerProfile;

  @Column({ name: 'image_path' })
  imagePath: string;

  @Column({ nullable: true, length: 120 })
  title?: string;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
