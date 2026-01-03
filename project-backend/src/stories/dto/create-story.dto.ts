import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;
}
