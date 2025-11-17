import { IsOptional, IsString, Matches, IsNumber, Min, Max, IsEnum } from "class-validator";

export class UpdateBuyerDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, { 
    message: 'Name must not contain any special characters or numbers' 
  })
  name?: string;

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