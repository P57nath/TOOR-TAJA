import { IsIn, IsString } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsString()
  @IsIn(['PENDING', 'SUCCESS', 'FAILED'])
  status: string;
}
