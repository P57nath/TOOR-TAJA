import { IsArray, IsIn, IsOptional, IsString, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString() productId: string;
  @IsInt() @Min(1) quantity: number;
}
export class CreateOrderDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional() @IsString() addressId?: string;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsString() @IsIn(['COD', 'ONLINE'])
  paymentMethod?: 'COD' | 'ONLINE';
  @IsOptional() @IsString() deliveryName?: string;
  @IsOptional() @IsString() deliveryPhone?: string;
  @IsOptional() @IsString() deliveryAddress?: string;
  @IsOptional() @IsString() deliverySlot?: string;
}
