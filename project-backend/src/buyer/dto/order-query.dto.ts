import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import * as orderEntity from '../entities/order.entity';

export class OrderQueryDto {
  @IsOptional() @IsEnum(['pending','paid','shipped','cancelled'] as const)
  status?: orderEntity.OrderStatus;

  @IsOptional() @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @IsInt() @Min(1) limit?: number = 20;
}
