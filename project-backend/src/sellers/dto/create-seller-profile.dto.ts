import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSellerProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  storeName: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
