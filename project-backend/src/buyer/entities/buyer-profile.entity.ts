import { Entity, PrimaryColumn, Column, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('buyers')
export class BuyerProfile {
  @PrimaryColumn()
  buyerId: string;

  @Column({name:'fullname', type:'varchar', length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  age?: number;

  @Column({ nullable: true })
  defaultAddressId?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  generateBuyerId() {
    if (!this.buyerId) {
      // Generate UUID and add prefix
      const uuid = uuidv4().split('-')[0]; // Take first part of UUID
      this.buyerId = `b_${uuid}`;
    }
  }
}

// Alternative ID generation strategies:
// @BeforeInsert()
//   async generateBuyerId() {
//     if (!this.buyerId) {
//       // Get the next ID from database
//       const lastBuyer = await BuyerProfile.find({
//         order: { buyerId: "DESC" },
//         take: 1
//       });
      
//       if (lastBuyer.length > 0) {
//         const lastId = lastBuyer[0].buyerId;
//         const lastNumber = parseInt(lastId.split('_')[1]);
//         this.buyerId = `b_${lastNumber + 1}`;
//       } else {
//         this.buyerId = 'b_1';
//       }
//     }
//   }


// import { v4 as uuidv4 } from 'uuid';

// @BeforeInsert()
//   generateBuyerId() {
//     if (!this.buyerId) {
//       // Generate UUID and add prefix
//       const uuid = uuidv4().split('-')[0]; // Take first part of UUID
//       this.buyerId = `b_${uuid}`;
//     }
//   }