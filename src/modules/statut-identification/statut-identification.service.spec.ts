import { Test, TestingModule } from '@nestjs/testing';
import { StatutIdentificationService } from './statut-identification.service';

describe('StatutIdentificationService', () => {
  let service: StatutIdentificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatutIdentificationService],
    }).compile();

    service = module.get<StatutIdentificationService>(StatutIdentificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
