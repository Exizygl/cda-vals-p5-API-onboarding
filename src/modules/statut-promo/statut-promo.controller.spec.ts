import { Test, TestingModule } from '@nestjs/testing';
import { StatutPromoController } from './statut-promo.controller';

describe('StatutPromoController', () => {
  let controller: StatutPromoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatutPromoController],
    }).compile();

    controller = module.get<StatutPromoController>(StatutPromoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
