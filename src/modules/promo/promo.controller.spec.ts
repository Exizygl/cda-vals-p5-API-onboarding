import { Test, TestingModule } from '@nestjs/testing';
import { PromoController } from './promo.controller';
import { IPromoService } from './interface/IPromoService';
import { IPromoServiceToken } from './promo.constants';
import { CreatePromoDto } from './dto/createPromo.dto';
import { UpdatePromoDto } from './dto/updatePromo.dto';
import { Promo } from './promo.entity';

describe('PromoController (Unit)', () => {
  let controller: PromoController;
  let service: jest.Mocked<IPromoService>;

  const mockPromo: Promo = {
    id: 'uuid-123',
    nom: 'Promo Test',
    dateDebut: new Date('2025-09-01'),
    dateFin: new Date('2025-12-01'),
    snowflake: '1000000000000000001',
    dateCreation: new Date(),
    dateModification: new Date(),
    statutPromo: { id: 1, libelle: 'actif', dateCreation: new Date(), dateModification: new Date() },
    formation: { id: '1000000000000000002', nom: 'Formation Test', actif: true, dateCreation: new Date(), dateModification: new Date() },
    campus: { id: '1000000000000000003', nom: 'Campus Test', actif: true, dateCreation: new Date(), dateModification: new Date() },
    identifications: [],
  };

  const mockPromoService = {
    findAll: jest.fn(),
    findActif: jest.fn(),
    findOne: jest.fn(),
    findOneBySnowflake: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromoController],
      providers: [
        {
          provide: IPromoServiceToken,
          useValue: mockPromoService,
        },
      ],
    }).compile();

    controller = module.get<PromoController>(PromoController);
    service = module.get(IPromoServiceToken);

    // Reset tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of promos', async () => {
      const promos = [mockPromo];
      service.findAll.mockResolvedValue(promos);

      const result = await controller.findAll();

      expect(result).toEqual(promos);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith();
    });

    it('should return an empty array when no promos exist', async () => {
      service.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findActif', () => {
    it('should return only active promos', async () => {
      const activePromos = [mockPromo];
      service.findActif.mockResolvedValue(activePromos);

      const result = await controller.findActif();

      expect(result).toEqual(activePromos);
      expect(service.findActif).toHaveBeenCalledTimes(1);
      expect(service.findActif).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a single promo by id', async () => {
      const id = 'uuid-123';
      service.findOne.mockResolvedValue(mockPromo);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockPromo);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw error when promo not found', async () => {
      const id = 'non-existent-id';
      service.findOne.mockRejectedValue(new Error('Promo not found'));

      await expect(controller.findOne(id)).rejects.toThrow('Promo not found');
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('findOneBySnowflake', () => {
    it('should return a promo by snowflake id', async () => {
      const snowflake = '1000000000000000001';
      service.findOneBySnowflake.mockResolvedValue(mockPromo);

      const result = await controller.findOneBySnowflake(snowflake);

      expect(result).toEqual(mockPromo);
      expect(service.findOneBySnowflake).toHaveBeenCalledTimes(1);
      expect(service.findOneBySnowflake).toHaveBeenCalledWith(snowflake);
    });

    it('should throw error when promo with snowflake not found', async () => {
      const snowflake = '9999999999999999999';
      service.findOneBySnowflake.mockRejectedValue(new Error('Promo not found'));

      await expect(controller.findOneBySnowflake(snowflake)).rejects.toThrow('Promo not found');
      expect(service.findOneBySnowflake).toHaveBeenCalledWith(snowflake);
    });
  });

  describe('create', () => {
    it('should create a new promo', async () => {
      const createDto: CreatePromoDto = {
        nom: 'Promo Test',
        dateDebut: new Date('2025-09-01'),
        dateFin: new Date('2025-12-01'),
        statutId: 1,
        formationId: '1000000000000000002',
        campusId: '1000000000000000003',
      };
      service.create.mockResolvedValue(mockPromo);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockPromo);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw error when creation fails', async () => {
      const createDto: CreatePromoDto = {
        nom: 'Invalid Promo',
        dateDebut: new Date('2025-09-01'),
        dateFin: new Date('2025-12-01'),
        statutId: 999,
        formationId: 'invalid',
        campusId: 'invalid',
      };
      service.create.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.create(createDto)).rejects.toThrow('Creation failed');
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an existing promo', async () => {
      const id = 'uuid-123';
      const updateDto: Partial<UpdatePromoDto> = {
        nom: 'Promo Updated',
      };
      const updatedPromo = { ...mockPromo, nom: 'Promo Updated' };
      service.update.mockResolvedValue(updatedPromo);

      const result = await controller.update(id, updateDto as UpdatePromoDto);

      expect(result).toEqual(updatedPromo);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw error when promo to update not found', async () => {
      const id = 'non-existent-id';
      const updateDto: Partial<UpdatePromoDto> = { nom: 'New Name' };
      service.update.mockRejectedValue(new Error('Promo not found'));

      await expect(controller.update(id, updateDto as UpdatePromoDto)).rejects.toThrow('Promo not found');
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should update only specified fields', async () => {
      const id = 'uuid-123';
      const updateDto: Partial<UpdatePromoDto> = {
        dateFin: new Date('2026-01-01'),
      };
      const updatedPromo = { ...mockPromo, dateFin: new Date('2026-01-01') };
      service.update.mockResolvedValue(updatedPromo);

      const result = await controller.update(id, updateDto as UpdatePromoDto);

      expect(result.dateFin).toEqual(new Date('2026-01-01'));
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });
});
