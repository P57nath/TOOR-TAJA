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

  
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

 
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName: string;

  
  @IsString()
  @IsNotEmpty()
  @Matches(/@aiub\.edu$/, { message: 'Email must belong to the aiub.edu domain.' })
  email: string;

  
  @IsString()
  @MinLength(6)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase character.' })
  password: string;

  
  @IsString({ message: 'Gender must not contain any number.' })
  @IsIn(['male', 'female'], { message: 'Gender must be male or female.'})
  gender: 'male' | 'female';

  
  @IsNumberString()
  phoneNumber: string;
}
