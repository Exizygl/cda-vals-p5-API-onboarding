import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FormationService } from './formation.service';
import { Formation } from './formation.entity';
import { FormationMapper } from './formation.mapper';
import { CreateFormationDto } from './dto/createFormation.dto';
import { UpdateFormationDto } from './dto/updateFormation.dto';

const createMockRepository = (): jest.Mocked<Repository<any>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
} as any);

describe('FormationService', () => {
  let service: FormationService;
  let repository: jest.Mocked<Repository<Formation>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormationService,
        {
          provide: getRepositoryToken(Formation),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<FormationService>(FormationService);
    repository = module.get(getRepositoryToken(Formation));
  });

  describe('findByIds', () => {
    it('should return formations by ids', async () => {
      const formations = [{ id: '1' } as Formation, { id: '2' } as Formation];
      repository.find.mockResolvedValue(formations);

      const result = await service.findByIds(['1', '2']);
      expect(repository.find).toHaveBeenCalledWith({ where: { id: expect.any(Object) } });
      expect(result).toEqual(formations);
    });
  });

  describe('findAll', () => {
    it('should return all formations', async () => {
      const formations = [{ id: '1' } as Formation];
      repository.find.mockResolvedValue(formations);

      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(formations);
    });
  });

  describe('findActif', () => {
    it('should return selectionnable formations', async () => {
      const formations = [{ id: '1', actif: true } as Formation];
      repository.find.mockResolvedValue(formations);

      const result = await service.findActif();
      expect(repository.find).toHaveBeenCalledWith({ where: { actif: true } });
      expect(result).toEqual(formations);
    });
  });

  describe('findOne', () => {
    it('should return a formation if found', async () => {
      const formation = { id: '1' } as Formation;
      repository.findOne.mockResolvedValue(formation);

      const result = await service.findOne('1');
      expect(result).toEqual(formation);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('99')).rejects.toThrow(NotFoundException);
    });
  });

describe('create', () => {
  it('should create and return a formation', async () => {
    const dto: CreateFormationDto = { id: '1', nom: 'Admin', actif: true };
    const mappedFormation = { ...dto } as Formation;

    jest.spyOn(FormationMapper, 'fromCreateDto').mockReturnValue(mappedFormation);
    repository.save.mockResolvedValue(mappedFormation);

    const result = await service.create(dto);
    expect(FormationMapper.fromCreateDto).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(mappedFormation);
    expect(result).toEqual(mappedFormation);
  });
});

  describe('update', () => {
    it('should update and return the formation', async () => {
      const existingFormation = { id: '1', nom: 'User' } as Formation;
      const dto: UpdateFormationDto = { nom: 'Updated' };
      const updatedFormation = { id: '1', nom: 'Updated' } as Formation;

      repository.findOne.mockResolvedValue(existingFormation);
      jest.spyOn(FormationMapper, 'fromUpdateDto').mockReturnValue(updatedFormation);
      repository.save.mockResolvedValue(updatedFormation);

      const result = await service.update('1', dto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(FormationMapper.fromUpdateDto).toHaveBeenCalledWith(dto, existingFormation);
      expect(repository.save).toHaveBeenCalledWith(updatedFormation);
      expect(result).toEqual(updatedFormation);
    });

    it('should throw NotFoundException if formation not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update('99', { nom: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the formation', async () => {
      const formation = { id: '1' } as Formation;
      repository.findOne.mockResolvedValue(formation);
      repository.remove.mockResolvedValue(formation);

      await service.remove('1');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.remove).toHaveBeenCalledWith(formation);
    });

    it('should throw NotFoundException if formation not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove('99')).rejects.toThrow(NotFoundException);
    });
  });
});
