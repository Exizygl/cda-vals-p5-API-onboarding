import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StatutIdentificationService } from './statutIdentification.service';
import { StatutIdentification } from './statutIdentification.entity';
import { StatutIdentificationMapper } from './statutIdentification.mapper';
import { CreateStatutIdentificationDto } from './dto/createStatutIdentification.dto';
import { UpdateStatutIdentificationDto } from './dto/updateStatutIdentification.dto';

const createMockRepository = (): jest.Mocked<Repository<any>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
} as any);

describe('StatutIdentificationService', () => {
  let service: StatutIdentificationService;
  let repository: jest.Mocked<Repository<StatutIdentification>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatutIdentificationService,
        {
          provide: getRepositoryToken(StatutIdentification),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<StatutIdentificationService>(StatutIdentificationService);
    repository = module.get(getRepositoryToken(StatutIdentification));
  });

  describe('findByIds', () => {
    it('should return statutIdentifications by ids', async () => {
      const statutIdentifications = [{ id: '1' } as StatutIdentification, { id: '2' } as StatutIdentification];
      repository.find.mockResolvedValue(statutIdentifications);

      const result = await service.findByIds(['1', '2']);
      expect(repository.find).toHaveBeenCalledWith({ where: { id: expect.any(Object) } });
      expect(result).toEqual(statutIdentifications);
    });
  });

  describe('findAll', () => {
    it('should return all statutIdentifications', async () => {
      const statutIdentifications = [{ id: '1' } as StatutIdentification];
      repository.find.mockResolvedValue(statutIdentifications);

      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(statutIdentifications);
    });
  });

  describe('findOne', () => {
    it('should return a statutIdentification if found', async () => {
      const statutIdentification = { id: '1' } as StatutIdentification;
      repository.findOne.mockResolvedValue(statutIdentification);

      const result = await service.findOne('1');
      expect(result).toEqual(statutIdentification);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('99')).rejects.toThrow(NotFoundException);
    });
  });

describe('create', () => {
  it('should create and return a statutIdentification', async () => {
    const dto: CreateStatutIdentificationDto = { libelle: 'Admin'};
    const mappedStatutIdentification = { ...dto } as StatutIdentification;

    jest.spyOn(StatutIdentificationMapper, 'fromCreateDto').mockReturnValue(mappedStatutIdentification);
    repository.save.mockResolvedValue(mappedStatutIdentification);

    const result = await service.create(dto);
    expect(StatutIdentificationMapper.fromCreateDto).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(mappedStatutIdentification);
    expect(result).toEqual(mappedStatutIdentification);
  });
});

  describe('update', () => {
    it('should update and return the statutIdentification', async () => {
      const existingStatutIdentification = { id: '1', libelle: 'User' } as StatutIdentification;
      const dto: UpdateStatutIdentificationDto = { libelle: 'Updated' };
      const updatedStatutIdentification = { id: '1', libelle: 'Updated' } as StatutIdentification;

      repository.findOne.mockResolvedValue(existingStatutIdentification);
      jest.spyOn(StatutIdentificationMapper, 'fromUpdateDto').mockReturnValue(updatedStatutIdentification);
      repository.save.mockResolvedValue(updatedStatutIdentification);

      const result = await service.update('1', dto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(StatutIdentificationMapper.fromUpdateDto).toHaveBeenCalledWith(dto, existingStatutIdentification);
      expect(repository.save).toHaveBeenCalledWith(updatedStatutIdentification);
      expect(result).toEqual(updatedStatutIdentification);
    });

    it('should throw NotFoundException if statutIdentification not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update('99', { libelle: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the statutIdentification', async () => {
      const statutIdentification = { id: '1' } as StatutIdentification;
      repository.findOne.mockResolvedValue(statutIdentification);
      repository.remove.mockResolvedValue(statutIdentification);

      await service.remove('1');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.remove).toHaveBeenCalledWith(statutIdentification);
    });

    it('should throw NotFoundException if statutIdentification not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove('99')).rejects.toThrow(NotFoundException);
    });
  });
});