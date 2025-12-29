import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/users/user.entity';

@Entity('admin_profiles')
export class AdminProfile {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateAdminProfileId() {
    if (!this.id) {
      this.id = `a_${uuidv4().split('-')[0]}`;
    }
  }

  @OneToOne(() => User, (user) => user.adminProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'display_name', type: 'varchar', length: 120 })
  displayName: string;

  @Column({ name: 'profile_name', type: 'varchar', nullable: true })
  profileName?: string;
}
