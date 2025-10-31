import { Test, TestingModule } from '@nestjs/testing';
import { BuyerService } from './buyer.service';

describe('BuyerService', () => {
  let service: BuyerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyerService],
    }).compile();

    service = module.get<BuyerService>(BuyerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
