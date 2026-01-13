import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;
}
