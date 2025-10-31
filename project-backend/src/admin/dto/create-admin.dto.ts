import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() name: string;

  @IsEnum(['superadmin', 'manager', 'support'] as const, {
    message: 'role must be superadmin | manager | support',
  })
  role: 'superadmin' | 'manager' | 'support';

  @IsOptional() @IsString() password?: string; // hashed in real app
}

