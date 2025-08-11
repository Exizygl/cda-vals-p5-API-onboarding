import { Test, TestingModule } from '@nestjs/testing';
import { CampusController } from './campus.controller';
import { ICampusService } from './interface/ICampusService';
import { CreateCampusDto } from './dto/createCampus.dto';
import { UpdateCampusDto } from './dto/updateCampus.dto';
import { Campus } from './campus.entity';
import { ICampusServiceToken } from './campus.constants';

describe('CampusController', () => {
  let controller: CampusController;
  let campusServiceMock: jest.Mocked<ICampusService>;

  const mockCampus: Campus = {
    id: '1',
    nom: 'Admin',
    actif: true,
    dateCreation: new Date(),
    dateModification: new Date(),
  };

  beforeEach(async () => {
    campusServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByIds: jest.fn(),
      findActif: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampusController],
      providers: [
        {
          provide: ICampusServiceToken,
          useValue: campusServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CampusController>(CampusController);
    campusServiceMock = module.get(ICampusServiceToken);
  });

  it('should return all campuss', async () => {
    campusServiceMock.findAll.mockResolvedValue([mockCampus]);
    const result = await controller.findAll();
    expect(result).toEqual([mockCampus]);
    expect(campusServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return a campus by id', async () => {
    campusServiceMock.findOne.mockResolvedValue(mockCampus);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockCampus);
    expect(campusServiceMock.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a campus', async () => {
    const dto: CreateCampusDto = {
      id: '1',
      nom: 'Admin',
      actif: true,
    };
    campusServiceMock.create.mockResolvedValue(mockCampus);
    const result = await controller.create(dto);
    expect(result).toEqual(mockCampus);
    expect(campusServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should update a campus', async () => {
    const dto: UpdateCampusDto = {
      nom: 'User',
    };
    campusServiceMock.update.mockResolvedValue({ ...mockCampus, nom: 'User' });
    const result = await controller.update('1', dto);
    expect(result.nom).toBe('User');
    expect(campusServiceMock.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove a campus', async () => {
    campusServiceMock.remove.mockResolvedValue(undefined);
    const result = await controller.remove('1');
    expect(result).toEqual({ message: 'Campus deleted successfully' });
    expect(campusServiceMock.remove).toHaveBeenCalledWith('1');
  });

  it('should return only actif campuss', async () => {
    campusServiceMock.findActif.mockResolvedValue([mockCampus]);
    const result = await controller.findActif();
    expect(result).toEqual([mockCampus]);
    expect(campusServiceMock.findActif).toHaveBeenCalled();
  });
});