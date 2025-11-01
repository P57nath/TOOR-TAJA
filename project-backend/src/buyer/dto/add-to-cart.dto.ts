import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsNotEmpty() name: string;
  @IsNumber() @Min(0) price: number;
  @IsInt() @Min(1) quantity: number;
}
