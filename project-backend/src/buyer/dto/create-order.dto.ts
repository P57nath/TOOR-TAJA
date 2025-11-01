import { IsArray, IsOptional, IsString, ValidateNested, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString() productId: string;
  @IsString() name: string;
  @IsNumber() @Min(0) price: number;
  @IsInt() @Min(1) quantity: number;
}
export class CreateOrderDto {
  @IsString() buyerId: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional() @IsString() addressId?: string;
  @IsOptional() @IsString() note?: string;
}
