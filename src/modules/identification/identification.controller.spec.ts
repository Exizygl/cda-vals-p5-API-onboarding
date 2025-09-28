import { Test, TestingModule } from '@nestjs/testing';
import { IdentificationController } from './identification.controller';
import { IIdentificationService } from './interface/IIdentificationService';
import { IIdentificationServiceToken } from './identification.constants';
import { Identification } from './identification.entity';
import { CreateIdentificationDto } from './dto/createIdentification.dto';
import { UpdateIdentificationDto } from './dto/updateIdentification.dto';

describe('IdentificationController', () => {
  let controller: IdentificationController;
  let service: jest.Mocked<IIdentificationService>;

  beforeEach(async () => {
    const mockService: jest.Mocked<IIdentificationService> = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentificationController],
      providers: [
        {
          provide: IIdentificationServiceToken,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<IdentificationController>(IdentificationController);
    service = module.get(IIdentificationServiceToken);
  });

  describe('getById', () => {
    it('should return an identification', async () => {
      const identification = { id: 'i1' } as Identification;
      service.findById.mockResolvedValue(identification);

      const result = await controller.getById('i1');

      expect(service.findById).toHaveBeenCalledWith('i1');
      expect(result).toBe(identification);
    });
  });

  describe('create', () => {
    it('should create and return an identification', async () => {
      const dto: CreateIdentificationDto = { promoId: 'p1', utilisateurId: 'u1' } as any;
      const identification = { id: 'i2' } as Identification;
      service.create.mockResolvedValue(identification);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(identification);
    });
  });

  describe('update', () => {
    it('should update and return an identification', async () => {
      const dto: UpdateIdentificationDto = { statutIdentificationId: 2 } as any;
      const identification = { id: 'i3' } as Identification;
      service.update.mockResolvedValue(identification);

      const result = await controller.update('i3', dto);

      expect(service.update).toHaveBeenCalledWith('i3', dto);
      expect(result).toBe(identification);
    });
  });
});
