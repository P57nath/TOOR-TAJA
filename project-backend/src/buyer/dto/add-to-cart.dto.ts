import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsInt() @Min(1) quantity: number;
}
