import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import * as orderEntity from '../entities/order.entity';

export class OrderQueryDto {
  @IsOptional() @IsEnum(['pending','paid','shipped','cancelled'] as const)
  status?: orderEntity.OrderStatus;

  @IsOptional()
  @IsNumber()
  page: number = 1; 

  @IsOptional()
  @IsNumber()
  limit: number = 20; 
}
