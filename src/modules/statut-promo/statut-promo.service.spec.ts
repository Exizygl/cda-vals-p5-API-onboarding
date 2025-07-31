import { Test, TestingModule } from '@nestjs/testing';
import { StatutPromoService } from './statut-promo.service';

describe('StatutPromoService', () => {
  let service: StatutPromoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatutPromoService],
    }).compile();

    service = module.get<StatutPromoService>(StatutPromoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
