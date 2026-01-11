import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSellerProfileDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  storeName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  businessInfo?: string;
}
