import { IsEmail, IsOptional, IsString } from 'class-validator';

export class BuyerProfileDto {
  @IsString() buyerId: string;
  @IsString() name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() defaultAddressId?: string;
}