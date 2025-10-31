import { IsInt, Min } from 'class-validator';
export class UpdateStockDto {
  @IsInt() @Min(0) stock: number;
}
