import { IsEmail, IsOptional, IsString, Matches, MinLength, IsNumber, Min, Max, IsEnum } from 'class-validator';

export class BuyerProfileDto {
  buyerId?: string;

  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, { 
    message: 'Name must not contain any special characters or numbers' 
  })
  name: string;

  @IsString()
  @IsEmail() 
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[a-z])/, { 
    message: 'Password must contain at least one lowercase character' 
  })
  password: string;

  @IsOptional() 
  @IsString()
  @Matches(/^01\d{9}$/, { 
    message: 'Phone number must start with 01 and be exactly 11 digits' 
  })
  phone?: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Age must be at least 1' })
  @Max(120, { message: 'Age must be less than 120' })
  age?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional() 
  @IsString() 
  defaultAddressId?: string;
}