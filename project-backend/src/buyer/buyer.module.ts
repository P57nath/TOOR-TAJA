import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';

@Module({
  controllers: [BuyerController],
  providers: [BuyerService],
})
export class BuyerModule {}
