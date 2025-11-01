import { IsString } from 'class-validator';
export class FilterCategoryDto {
  @IsString() category: string;
}