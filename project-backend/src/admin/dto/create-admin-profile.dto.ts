import { IsOptional, IsString } from 'class-validator';

export class CreateAdminProfileDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}
