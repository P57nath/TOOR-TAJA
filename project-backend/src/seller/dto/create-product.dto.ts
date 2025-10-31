import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @IsNumber() @Min(0) price: number;
  @IsString() @IsNotEmpty() category: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0) stock?: number;
}
