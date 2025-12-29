import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsNumberString,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  storeName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/@aiub\.edu$/, { message: 'Email must belong to the aiub.edu domain.' })
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase character.' })
  password: string;

  @IsNumberString()
  phone: string;

  @IsOptional()
  @IsEnum(['PENDING', 'APPROVED', 'SUSPENDED'])
  status?: 'PENDING' | 'APPROVED' | 'SUSPENDED';
}
