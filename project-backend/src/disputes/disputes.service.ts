import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispute } from './dispute.entity';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class DisputesService {
  constructor(
    @InjectRepository(Dispute)
    private readonly disputeRepository: Repository<Dispute>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createDispute(userId: string, orderId: string, reason?: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId, userId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== 'DELIVERED') {
      throw new ForbiddenException('Disputes allowed only for delivered orders');
    }

    const dispute = this.disputeRepository.create({
      orderId,
      buyerUserId: userId,
      reason,
      status: 'OPEN',
    });
    return this.disputeRepository.save(dispute);
  }
}
