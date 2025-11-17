import { IsOptional, IsNumber, Min, Max } from "class-validator";

export class GetBuyersOverAgeDto {
  @IsOptional()
  @IsNumber()
  @Min(40)
  age?: number = 40;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}