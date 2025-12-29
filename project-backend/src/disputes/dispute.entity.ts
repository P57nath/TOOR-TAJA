import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export type DisputeStatus = 'OPEN' | 'RESOLVED';

@Entity('disputes')
export class Dispute {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `d_${uuidv4().split('-')[0]}`;
    }
  }

  @Column()
  orderId: string;

  @Column()
  buyerUserId: string;

  @Column({ type: 'enum', enum: ['OPEN', 'RESOLVED'], default: 'OPEN' })
  status: DisputeStatus;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'text', nullable: true })
  resolutionNote?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;
}
