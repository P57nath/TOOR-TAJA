import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAdminProfileDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  profileName?: string;
}
