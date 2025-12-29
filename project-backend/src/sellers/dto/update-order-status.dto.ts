import { IsIn } from 'class-validator';
import { OrderStatus } from 'src/orders/entities/order.entity';

export class UpdateOrderStatusDto {
  @IsIn(['PROCESSING', 'SHIPPED', 'DELIVERED'])
  status: OrderStatus;
}
