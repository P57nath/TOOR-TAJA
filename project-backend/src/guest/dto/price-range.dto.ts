import { IsNumber, Min } from 'class-validator';
export class PriceRangeDto {
  @IsNumber() @Min(0) min: number;
  @IsNumber() @Min(0) max: number;
}