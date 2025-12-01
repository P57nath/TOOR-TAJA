import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;
}