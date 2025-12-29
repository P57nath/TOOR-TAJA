import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './dispute.entity';
import { DisputesService } from './disputes.service';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dispute, Order])],
  providers: [DisputesService],
  exports: [DisputesService, TypeOrmModule],
})
export class DisputesModule {}
