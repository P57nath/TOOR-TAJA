import { Transform, Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @Type(() => Number)
  @IsNumber() @Min(0)
  price: number;
  @IsString() @IsNotEmpty() subcategoryId: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() @IsIn(['each', 'kg', 'g', 'pcs', 'ml', 'L'])
  unit?: string;
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @Type(() => Number)
  @IsOptional() @IsNumber() @Min(0)
  unitValue?: number;
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @Type(() => Number)
  @IsOptional() @IsNumber() @Min(0)
  stock?: number;
}
