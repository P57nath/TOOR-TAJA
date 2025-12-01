import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Admin } from '../../admin/entities/admin.entity';

@Entity()
export class AdminProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToOne(() => Admin, (admin) => admin.profile, { onDelete: 'CASCADE' })
  @JoinColumn()  // this table will store the foreign key
  admin: Admin;
}
