import {
    Entity,
    PrimaryColumn,
    Column,
    BeforeInsert,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
    import { v4 as uuidv4 } from 'uuid';
  
  @Entity('sellers')
  export class Seller {
  
    
    @PrimaryColumn()
    id: string;
  
    @BeforeInsert()
    generateSellerId() { 
      if (!this.id) {
       
        const uuid = uuidv4().split('-')[0]; 
        this.id = `s_${uuid}`; 
      }
    }
  
    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;
  
    @Column({ type: 'varchar', length: 150 })
    fullName: string;
  
    @Column({ type: 'boolean', default: false })
    isActive: boolean; 
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column({
      type: 'enum',
      enum: ['male', 'female'],
    })
    gender: 'male' | 'female';
  
    @Column()
    phoneNumber: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }