import { Test, TestingModule } from '@nestjs/testing';
import { StatutIdentificationController } from './statut-identification.controller';

describe('StatutIdentificationController', () => {
  let controller: StatutIdentificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatutIdentificationController],
    }).compile();

    controller = module.get<StatutIdentificationController>(StatutIdentificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
