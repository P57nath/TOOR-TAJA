import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

class BuyerProfileInput {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  defaultAddressId?: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}

class SellerProfileInput {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'APPROVED', 'SUSPENDED'])
  status?: 'PENDING' | 'APPROVED' | 'SUSPENDED';
}

class AdminProfileInput {
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsOptional()
  @IsString()
  profileName?: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @ValidateNested()
  @Type(() => BuyerProfileInput)
  buyerProfile?: BuyerProfileInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => SellerProfileInput)
  sellerProfile?: SellerProfileInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminProfileInput)
  adminProfile?: AdminProfileInput;
}
