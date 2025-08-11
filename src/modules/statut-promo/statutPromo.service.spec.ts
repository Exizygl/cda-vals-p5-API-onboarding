import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StatutPromoService } from './statutPromo.service';
import { StatutPromo } from './statutPromo.entity';
import { StatutPromoMapper } from './statutPromo.mapper';
import { CreateStatutPromoDto } from './dto/createStatutPromo.dto';
import { UpdateStatutPromoDto } from './dto/updateStatutPromo.dto';

const createMockRepository = (): jest.Mocked<Repository<any>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
} as any);

describe('StatutPromoService', () => {
  let service: StatutPromoService;
  let repository: jest.Mocked<Repository<StatutPromo>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatutPromoService,
        {
          provide: getRepositoryToken(StatutPromo),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<StatutPromoService>(StatutPromoService);
    repository = module.get(getRepositoryToken(StatutPromo));
  });

  describe('findByIds', () => {
    it('should return statutPromos by ids', async () => {
      const statutPromos = [{ id: '1' } as StatutPromo, { id: '2' } as StatutPromo];
      repository.find.mockResolvedValue(statutPromos);

      const result = await service.findByIds(['1', '2']);
      expect(repository.find).toHaveBeenCalledWith({ where: { id: expect.any(Object) } });
      expect(result).toEqual(statutPromos);
    });
  });

  describe('findAll', () => {
    it('should return all statutPromos', async () => {
      const statutPromos = [{ id: '1' } as StatutPromo];
      repository.find.mockResolvedValue(statutPromos);

      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(statutPromos);
    });
  });

  describe('findOne', () => {
    it('should return a statutPromo if found', async () => {
      const statutPromo = { id: '1' } as StatutPromo;
      repository.findOne.mockResolvedValue(statutPromo);

      const result = await service.findOne('1');
      expect(result).toEqual(statutPromo);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('99')).rejects.toThrow(NotFoundException);
    });
  });

describe('create', () => {
  it('should create and return a statutPromo', async () => {
    const dto: CreateStatutPromoDto = { libelle: 'Admin'};
    const mappedStatutPromo = { ...dto } as StatutPromo;

    jest.spyOn(StatutPromoMapper, 'fromCreateDto').mockReturnValue(mappedStatutPromo);
    repository.save.mockResolvedValue(mappedStatutPromo);

    const result = await service.create(dto);
    expect(StatutPromoMapper.fromCreateDto).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(mappedStatutPromo);
    expect(result).toEqual(mappedStatutPromo);
  });
});

  describe('update', () => {
    it('should update and return the statutPromo', async () => {
      const existingStatutPromo = { id: '1', libelle: 'User' } as StatutPromo;
      const dto: UpdateStatutPromoDto = { libelle: 'Updated' };
      const updatedStatutPromo = { id: '1', libelle: 'Updated' } as StatutPromo;

      repository.findOne.mockResolvedValue(existingStatutPromo);
      jest.spyOn(StatutPromoMapper, 'fromUpdateDto').mockReturnValue(updatedStatutPromo);
      repository.save.mockResolvedValue(updatedStatutPromo);

      const result = await service.update('1', dto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(StatutPromoMapper.fromUpdateDto).toHaveBeenCalledWith(dto, existingStatutPromo);
      expect(repository.save).toHaveBeenCalledWith(updatedStatutPromo);
      expect(result).toEqual(updatedStatutPromo);
    });

    it('should throw NotFoundException if statutPromo not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update('99', { libelle: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the statutPromo', async () => {
      const statutPromo = { id: '1' } as StatutPromo;
      repository.findOne.mockResolvedValue(statutPromo);
      repository.remove.mockResolvedValue(statutPromo);

      await service.remove('1');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.remove).toHaveBeenCalledWith(statutPromo);
    });

    it('should throw NotFoundException if statutPromo not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove('99')).rejects.toThrow(NotFoundException);
    });
  });
});
