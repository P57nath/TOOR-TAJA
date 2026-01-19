
// import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
// import { Seller } from './seller.entity';

// @Entity('seller_profiles')
// export class SellerProfile {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   bio: string;

//   @Column({ nullable: true })
//   websiteUrl: string;

//   @Column({ nullable: true })
//   location: string;

  
//   @OneToOne(() => Seller, (seller) => seller.profile, { onDelete: 'CASCADE' })
//   @JoinColumn() 
//   seller: Seller;
// }