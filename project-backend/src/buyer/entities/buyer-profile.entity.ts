import { Admin } from "src/admin/entities/admin.entity";
import { Entity, PrimaryColumn, Column, BeforeInsert, ManyToOne } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('buyers')
export class BuyerProfile {
  @PrimaryColumn({unsigned: true})
  buyerId: string;

  @Column({name:'fullname', type:'varchar', length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'int', unsigned: true})
  age?: number;
  
  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive' = 'active';

  @Column({ nullable: true })
  defaultAddressId?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // MANY BUYERS BELONG TO ONE ADMIN
  @ManyToOne(() => Admin, (admin) => admin.buyers, { onDelete: 'SET NULL', nullable: true })
  admin: Admin;

  @BeforeInsert()
  generateBuyerId() {
    if (!this.buyerId) {
      const uuid = uuidv4().split('-')[0]; 
      this.buyerId = `b_${uuid}`;
    }
  }
}