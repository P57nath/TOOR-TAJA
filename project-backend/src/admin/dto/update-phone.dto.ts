import {  IsNotEmpty, Matches } from 'class-validator';

export class UpdatePhoneDto {


 
   
   @IsNotEmpty()
   @Matches(/^01\d{9}$/, {
   message: 'Phone number must start with 01 and be exactly 11 digits long',
 })
   phone: number;
}
