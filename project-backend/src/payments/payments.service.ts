import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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

  async listByUser(userId: string, status?: string, limit?: number) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }
    const intents = await this.paymentRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return { success: true, data: intents, total: intents.length };
  }

  async getForUser(userId: string, intentId: string) {
    const intent = await this.paymentRepository.findOne({ where: { id: intentId } });
    if (!intent) {
      throw new NotFoundException('Payment intent not found');
    }
    if (intent.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }
    return { success: true, data: intent };
  }

  async markSuccessForUser(userId: string, intentId: string) {
    const intent = await this.paymentRepository.findOne({ where: { id: intentId } });
    if (!intent) {
      throw new NotFoundException('Payment intent not found');
    }
    if (intent.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }
    return this.markSuccess(intentId);
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
    order.transactionId = intent.id;
    await this.orderRepository.save(order);
    intent.status = 'SUCCESS';
    return this.paymentRepository.save(intent);
  }

  async finalizeCodPayment(orderId: string) {
    const intent = await this.paymentRepository.findOne({ where: { orderId } });
    if (!intent) {
      throw new NotFoundException('Payment intent not found');
    }
    if (intent.status === 'SUCCESS') {
      return intent;
    }
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const items = await this.orderItemRepository.find({ where: { orderId: order.id } });
    for (const item of items) {
      await this.inventoryService.commitReservation(item.productId, item.quantity);
    }

    order.paidAt = order.paidAt ?? new Date();
    order.transactionId = intent.id;
    await this.orderRepository.save(order);
    intent.status = 'SUCCESS';
    return this.paymentRepository.save(intent);
  }

  async markFailed(intentId: string) {
    const intent = await this.paymentRepository.findOne({ where: { id: intentId } });
    if (!intent) {
      throw new NotFoundException('Payment intent not found');
    }
    intent.status = 'FAILED';
    return this.paymentRepository.save(intent);
  }

  async createSslCommerzSession(
    intentId: string,
    amount: number,
    customer: { email?: string; name?: string },
  ) {
    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePass = process.env.SSLCOMMERZ_STORE_PASSWORD;
    if (!storeId || !storePass) {
      throw new BadRequestException('SSLCOMMERZ credentials are not configured');
    }
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === 'true';
    const baseUrl = isLive
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';
    const backendUrl = process.env.BACKEND_BASE_URL || 'http://localhost:5010';
    const payload = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePass,
      total_amount: String(amount),
      currency: 'BDT',
      tran_id: intentId,
      success_url: `${backendUrl}/payments/sslcommerz/success`,
      fail_url: `${backendUrl}/payments/sslcommerz/fail`,
      cancel_url: `${backendUrl}/payments/sslcommerz/cancel`,
      ipn_url: `${backendUrl}/payments/sslcommerz/ipn`,
      product_category: 'Grocery',
      product_name: 'TOOR-TAJA Order',
      cus_name: customer.name || 'Buyer',
      cus_email: customer.email || 'buyer@toortaja.com',
      shipping_method: 'NO',
      num_of_item: '1',
      product_profile: 'general',
    });

    const response = await fetch(`${baseUrl}/gwprocess/v4/api.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });

    if (!response.ok) {
      throw new BadRequestException('Unable to initialize SSLCOMMERZ session');
    }
    const data = await response.json();
    if (!data?.GatewayPageURL) {
      throw new BadRequestException('Invalid SSLCOMMERZ response');
    }

    return { gatewayUrl: data.GatewayPageURL };
  }
}
