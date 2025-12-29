import { IsIn } from 'class-validator';
import { OrderStatus } from 'src/buyer/entities/order.entity';

export class UpdateOrderStatusDto {
  @IsIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
  status: OrderStatus;
}
