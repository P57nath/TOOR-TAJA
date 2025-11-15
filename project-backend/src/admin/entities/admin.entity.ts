import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../enums/role';
@Entity()
export class Admin {
@PrimaryColumn()
  id: string;
  @Column({unique : true})
  email: string;
  @Column({name:'full_name', type:'varchar',nullable:true})
  name: string;
  @Column({type:'bigint',unsigned:true})
  phone: number;
  @Column({type:'varchar',unique:true})
  nid: string;
  @Column({default:true})
  isActive: boolean;
  @Column({type:'enum', enum: Role, default: Role.Support})
  role: Role;
  @Column({name:'profile_name', type:'varchar', nullable:true})
  profileName?: string;
  @Column({type:'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;
  @Column({type:'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

 @BeforeInsert()
  generateAdminId() {
    if (!this.id) {
      
      const uuid = uuidv4().split('-')[0]; //f3c1a8a2-8b4e-4e7d-9c3a-827b7d1afc92
      this.id = `admin_${uuid}`;
    }
  }
}

