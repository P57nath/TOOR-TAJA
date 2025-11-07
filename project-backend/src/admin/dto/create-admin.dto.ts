import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../enums/role';
export class CreateAdminDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() name: string;

   @IsEnum(Role, {
    message: 'role must be superadmin | manager | support',
  })
  role: Role;
  @IsOptional() @IsString() profileName?: string;// newly added for profile
  
}

