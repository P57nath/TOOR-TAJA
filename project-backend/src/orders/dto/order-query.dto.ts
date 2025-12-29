import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import * as orderEntity from '../entities/order.entity';

export class OrderQueryDto {
  @IsOptional() @IsEnum(['CREATED','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED'] as const)
  status?: orderEntity.OrderStatus;

  @IsOptional()
  @IsNumber()
  page: number = 1; 

  @IsOptional()
  @IsNumber()
  limit: number = 20; 
}
