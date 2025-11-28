import { Type } from 'class-transformer';
import { IsOptional, Min, Max, IsInt } from 'class-validator';

export class GetNullNamesDto {

  @IsOptional()
  @Type(() => Number)      // Converts string query to number
  @IsInt({ message: 'page must be int' })
  @Min(1, { message: 'page must not be less than 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)      // Converts string query to number
  @IsInt({ message: 'limit must be int' })
  @Min(1, { message: 'limit must not be less than 1' })  // relaxed from 20
  @Max(100, { message: 'limit must not be more than 100' })
  limit?: number = 10;

}
