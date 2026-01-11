import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateBuyerDto } from './update-buyer.dto';

export class UpdateBuyerProfileDto extends UpdateBuyerDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;
}
