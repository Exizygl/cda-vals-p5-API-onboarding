import { Test, TestingModule } from '@nestjs/testing';
import { StatutIdentificationController } from './statutIdentification.controller';
import { IStatutIdentificationService } from './interface/IStatutIdentificationService';
import { CreateStatutIdentificationDto } from './dto/createStatutIdentification.dto';
import { UpdateStatutIdentificationDto } from './dto/updateStatutIdentification.dto';
import { StatutIdentification } from './statutIdentification.entity';
import { IStatutIdentificationServiceToken } from './statutIdentification.constants';

describe('StatutIdentificationController', () => {
  let controller: StatutIdentificationController;
  let statutIdentificationServiceMock: jest.Mocked<IStatutIdentificationService>;

  const mockStatutIdentification: StatutIdentification = {
    id: 1,
    libelle: 'Admin',
    dateCreation: new Date(),
    dateModification: new Date(),
  };

  beforeEach(async () => {
    statutIdentificationServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatutIdentificationController],
      providers: [
        {
          provide: IStatutIdentificationServiceToken,
          useValue: statutIdentificationServiceMock,
        },
      ],
    }).compile();

    controller = module.get<StatutIdentificationController>(StatutIdentificationController);
    statutIdentificationServiceMock = module.get(IStatutIdentificationServiceToken);
  });

  it('should return all statutIdentifications', async () => {
    statutIdentificationServiceMock.findAll.mockResolvedValue([mockStatutIdentification]);
    const result = await controller.findAll();
    expect(result).toEqual([mockStatutIdentification]);
    expect(statutIdentificationServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return a statutIdentification by id', async () => {
    statutIdentificationServiceMock.findOne.mockResolvedValue(mockStatutIdentification);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockStatutIdentification);
    expect(statutIdentificationServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a statutIdentification', async () => {
    const dto: CreateStatutIdentificationDto = {
      libelle: 'Admin',
    };
    statutIdentificationServiceMock.create.mockResolvedValue(mockStatutIdentification);
    const result = await controller.create(dto);
    expect(result).toEqual(mockStatutIdentification);
    expect(statutIdentificationServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should update a statutIdentification', async () => {
    const dto: UpdateStatutIdentificationDto = {
      libelle: 'User',
    };
    statutIdentificationServiceMock.update.mockResolvedValue({ ...mockStatutIdentification, libelle: 'User' });
    const result = await controller.update(1, dto);
    expect(result.libelle).toBe('User');
    expect(statutIdentificationServiceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a statutIdentification', async () => {
    statutIdentificationServiceMock.remove.mockResolvedValue(undefined);
    const result = await controller.remove(1);
    expect(result).toEqual({ message: 'statutIdentification deleted successfully' });
    expect(statutIdentificationServiceMock.remove).toHaveBeenCalledWith(1);
  });
});