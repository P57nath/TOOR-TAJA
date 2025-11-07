import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../enums/role';
export class UpdateRoleDto {

 @IsEnum(Role, {
    message: 'role must be superadmin | manager | support',
  })
  role: Role;
  @IsNotEmpty()
  reason: string; 
}
