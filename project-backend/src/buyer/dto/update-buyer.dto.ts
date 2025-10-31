import { PartialType } from '@nestjs/mapped-types';
import { CreateBuyerDto } from './create-buyer.dto';

export class UpdateBuyerDto extends PartialType(CreateBuyerDto) {}
