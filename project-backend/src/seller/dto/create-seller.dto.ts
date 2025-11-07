import { IsNotEmpty, IsString, MinLength, Matches, IsIn, IsNumberString } from 'class-validator';

export class CreateSellerDto {

  // Email: required, must contain aiub.edu domain
  @IsString()
  @IsNotEmpty()
  @Matches(/@aiub\.edu$/, { message: 'Email must belong to the aiub.edu domain.' })
  email: string;

  // Password: at least 6 characters long and must contain one Uppercase character
  @IsString()
  @MinLength(6)
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase character.' })
  password: string;

  // Gender: Validate gender given male or female.
  @IsString()
  @IsIn(['male', 'female'], { message: 'Gender must be male or female.' })
  gender: 'male' | 'female';

  // Phone Number: must contain only numbers
  @IsNumberString()
  phoneNumber: string;
}