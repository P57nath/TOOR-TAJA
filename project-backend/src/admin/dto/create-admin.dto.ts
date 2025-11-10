import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Role } from '../enums/role';

export class CreateAdminDto {

 @IsEmail({}, { message: 'Must be a valid & filled email address' })
 @Matches(/^[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.)?(xyz)$/i, {
  message: 'Email must end with .xyz domain',})
  email: string;

 // @IsString({ message: 'Name must be a string' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name can only contain alphabets' }) 
  @IsNotEmpty()
  name: string;
   
  @IsString()
  @Matches(/^(\d{10}|\d{13}|\d{17})$/, { message: 'NID must be 10, 13, or 17 digits long' })
  nid: string;

  @IsEnum(Role, {
    message: 'role must be superadmin | manager | support',
  })
  role: Role;

  @IsOptional() @IsString()
   profileName?: string;
  
}

