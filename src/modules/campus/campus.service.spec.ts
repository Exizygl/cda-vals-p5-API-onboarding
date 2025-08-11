import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CampusService } from './campus.service';
import { Campus } from './campus.entity';
import { CampusMapper } from './campus.mapper';
import { CreateCampusDto } from './dto/createCampus.dto';
import { UpdateCampusDto } from './dto/updateCampus.dto';

const createMockRepository = (): jest.Mocked<Repository<any>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
} as any);

describe('CampusService', () => {
  let service: CampusService;
  let repository: jest.Mocked<Repository<Campus>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampusService,
        {
          provide: getRepositoryToken(Campus),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CampusService>(CampusService);
    repository = module.get(getRepositoryToken(Campus));
  });

  describe('findByIds', () => {
    it('should return campuss by ids', async () => {
      const campuss = [{ id: '1' } as Campus, { id: '2' } as Campus];
      repository.find.mockResolvedValue(campuss);

      const result = await service.findByIds(['1', '2']);
      expect(repository.find).toHaveBeenCalledWith({ where: { id: expect.any(Object) } });
      expect(result).toEqual(campuss);
    });
  });

  describe('findAll', () => {
    it('should return all campuss', async () => {
      const campuss = [{ id: '1' } as Campus];
      repository.find.mockResolvedValue(campuss);

      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(campuss);
    });
  });

  describe('findActif', () => {
    it('should return selectionnable campuss', async () => {
      const campuss = [{ id: '1', actif: true } as Campus];
      repository.find.mockResolvedValue(campuss);

      const result = await service.findActif();
      expect(repository.find).toHaveBeenCalledWith({ where: { actif: true } });
      expect(result).toEqual(campuss);
    });
  });

  describe('findOne', () => {
    it('should return a campus if found', async () => {
      const campus = { id: '1' } as Campus;
      repository.findOne.mockResolvedValue(campus);

      const result = await service.findOne('1');
      expect(result).toEqual(campus);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('99')).rejects.toThrow(NotFoundException);
    });
  });

describe('create', () => {
  it('should create and return a campus', async () => {
    const dto: CreateCampusDto = { id: '1', nom: 'Admin', actif: true };
    const mappedCampus = { ...dto } as Campus;

    jest.spyOn(CampusMapper, 'fromCreateDto').mockReturnValue(mappedCampus);
    repository.save.mockResolvedValue(mappedCampus);

    const result = await service.create(dto);
    expect(CampusMapper.fromCreateDto).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(mappedCampus);
    expect(result).toEqual(mappedCampus);
  });
});

  describe('update', () => {
    it('should update and return the campus', async () => {
      const existingCampus = { id: '1', nom: 'User' } as Campus;
      const dto: UpdateCampusDto = { nom: 'Updated' };
      const updatedCampus = { id: '1', nom: 'Updated' } as Campus;

      repository.findOne.mockResolvedValue(existingCampus);
      jest.spyOn(CampusMapper, 'fromUpdateDto').mockReturnValue(updatedCampus);
      repository.save.mockResolvedValue(updatedCampus);

      const result = await service.update('1', dto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(CampusMapper.fromUpdateDto).toHaveBeenCalledWith(dto, existingCampus);
      expect(repository.save).toHaveBeenCalledWith(updatedCampus);
      expect(result).toEqual(updatedCampus);
    });

    it('should throw NotFoundException if campus not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update('99', { nom: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the campus', async () => {
      const campus = { id: '1' } as Campus;
      repository.findOne.mockResolvedValue(campus);
      repository.remove.mockResolvedValue(campus);

      await service.remove('1');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.remove).toHaveBeenCalledWith(campus);
    });

    it('should throw NotFoundException if campus not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove('99')).rejects.toThrow(NotFoundException);
    });
  });
});
