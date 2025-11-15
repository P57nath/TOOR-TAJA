import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsIn,
  IsNumberString,
  MaxLength
} from 'class-validator';

export class CreateSellerDto {

  // Username: required, max-length 100
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  // Full Name: required, max-length 150
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName: string;

  // Email: must end with aiub.edu
  @IsString()
  @IsNotEmpty()
  @Matches(/@aiub\.edu$/, { message: 'Email must belong to the aiub.edu domain.' })
  email: string;

  // Password: min 6 chars, must have 1 uppercase
  @IsString()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase character.' })
  password: string;

  // Gender: male or female only
  @IsString({ message: 'Gender must not contain any number.' })
  @IsIn(['male', 'female'], { message: 'Gender must be male or female.'})
  gender: 'male' | 'female';

  // Phone Number: only digits
  @IsNumberString()
  phoneNumber: string;
}
