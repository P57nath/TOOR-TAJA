import { IsEnum } from "class-validator";

export class UpdateBuyerStatusDto {
  @IsEnum(['active', 'inactive'], {
    message: 'Status must be either active or inactive'
  })
  status: 'active' | 'inactive';
}