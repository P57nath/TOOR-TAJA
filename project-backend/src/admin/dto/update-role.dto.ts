import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsEnum(['superadmin', 'manager', 'support'] as const)
  role: 'superadmin' | 'manager' | 'support';

  @IsNotEmpty()
  reason: string; // why role changed (audit)
}
