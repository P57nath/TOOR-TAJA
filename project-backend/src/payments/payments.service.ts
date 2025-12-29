import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentIntent, PaymentStatus } from './payment-intent.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-items.entity';
import { InventoryService } from 'src/inventory/inventory.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentIntent)
    private readonly paymentRepository: Repository<PaymentIntent>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly inventoryService: InventoryService,
  ) {}

  createIntent(orderId: string, userId: string, amount: number, provider = 'MANUAL') {
    const intent = this.paymentRepository.create({
      orderId,
      userId,
      amount,
      provider,
      status: 'PENDING',
    });
    return this.paymentRepository.save(intent);
  }

  updateStatus(id: string, status: PaymentStatus) {
    return this.paymentRepository.update({ id }, { status });
  }

  async markSuccess(intentId: string) {
    const intent = await this.paymentRepository.findOne({ where: { id: intentId } });
    if (!intent) {
      throw new NotFoundException('Payment intent not found');
    }
    const order = await this.orderRepository.findOne({ where: { id: intent.orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status === 'PAID') {
      return intent;
    }

    const items = await this.orderItemRepository.find({ where: { orderId: order.id } });
    for (const item of items) {
      await this.inventoryService.commitReservation(item.productId, item.quantity);
    }

    order.updateStatus('PAID');
    await this.orderRepository.save(order);
    intent.status = 'SUCCESS';
    return this.paymentRepository.save(intent);
  }
}
