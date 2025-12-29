import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(0)
  stock: number;
}
