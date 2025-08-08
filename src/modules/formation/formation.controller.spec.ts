import { Test, TestingModule } from '@nestjs/testing';
import { FormationController } from './formation.controller';
import { IFormationService } from './interface/IFormationService';
import { CreateFormationDto } from './dto/createFormation.dto';
import { UpdateFormationDto } from './dto/updateFormation.dto';
import { Formation } from './formation.entity';
import { IFormationServiceToken } from './formation.constants';

describe('FormationController', () => {
  let controller: FormationController;
  let formationServiceMock: jest.Mocked<IFormationService>;

  const mockFormation: Formation = {
    id: '1',
    nom: 'Admin',
    actif: true,
    dateCreation: new Date(),
    dateModification: new Date(),
  };

  beforeEach(async () => {
    formationServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByIds: jest.fn(),
      findActif: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormationController],
      providers: [
        {
          provide: IFormationServiceToken,
          useValue: formationServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FormationController>(FormationController);
    formationServiceMock = module.get(IFormationServiceToken);
  });

  it('should return all formations', async () => {
    formationServiceMock.findAll.mockResolvedValue([mockFormation]);
    const result = await controller.findAll();
    expect(result).toEqual([mockFormation]);
    expect(formationServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return a formation by id', async () => {
    formationServiceMock.findOne.mockResolvedValue(mockFormation);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockFormation);
    expect(formationServiceMock.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a formation', async () => {
    const dto: CreateFormationDto = {
      id: '1',
      nom: 'Admin',
      actif: true,
    };
    formationServiceMock.create.mockResolvedValue(mockFormation);
    const result = await controller.create(dto);
    expect(result).toEqual(mockFormation);
    expect(formationServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should update a formation', async () => {
    const dto: UpdateFormationDto = {
      nom: 'User',
    };
    formationServiceMock.update.mockResolvedValue({ ...mockFormation, nom: 'User' });
    const result = await controller.update('1', dto);
    expect(result.nom).toBe('User');
    expect(formationServiceMock.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove a formation', async () => {
    formationServiceMock.remove.mockResolvedValue(undefined);
    const result = await controller.remove('1');
    expect(result).toEqual({ message: 'Formation deleted successfully' });
    expect(formationServiceMock.remove).toHaveBeenCalledWith('1');
  });

  it('should return only actif formations', async () => {
    formationServiceMock.findActif.mockResolvedValue([mockFormation]);
    const result = await controller.findActif();
    expect(result).toEqual([mockFormation]);
    expect(formationServiceMock.findActif).toHaveBeenCalled();
  });
});