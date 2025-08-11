import { Test, TestingModule } from '@nestjs/testing';
import { StatutPromoController } from './statutPromo.controller';
import { IStatutPromoService } from './interface/IStatutPromoService';
import { CreateStatutPromoDto } from './dto/createStatutPromo.dto';
import { UpdateStatutPromoDto } from './dto/updateStatutPromo.dto';
import { StatutPromo } from './statutPromo.entity';
import { IStatutPromoServiceToken } from './statutPromo.constants';

describe('StatutPromoController', () => {
  let controller: StatutPromoController;
  let statutPromoServiceMock: jest.Mocked<IStatutPromoService>;

  const mockStatutPromo: StatutPromo = {
    id: '1',
    libelle: 'Admin',
    dateCreation: new Date(),
    dateModification: new Date(),
  };

  beforeEach(async () => {
    statutPromoServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatutPromoController],
      providers: [
        {
          provide: IStatutPromoServiceToken,
          useValue: statutPromoServiceMock,
        },
      ],
    }).compile();

    controller = module.get<StatutPromoController>(StatutPromoController);
    statutPromoServiceMock = module.get(IStatutPromoServiceToken);
  });

  it('should return all statutPromos', async () => {
    statutPromoServiceMock.findAll.mockResolvedValue([mockStatutPromo]);
    const result = await controller.findAll();
    expect(result).toEqual([mockStatutPromo]);
    expect(statutPromoServiceMock.findAll).toHaveBeenCalled();
  });

  it('should return a statutPromo by id', async () => {
    statutPromoServiceMock.findOne.mockResolvedValue(mockStatutPromo);
    const result = await controller.findOne('1');
    expect(result).toEqual(mockStatutPromo);
    expect(statutPromoServiceMock.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a statutPromo', async () => {
    const dto: CreateStatutPromoDto = {
      libelle: 'Admin',
    };
    statutPromoServiceMock.create.mockResolvedValue(mockStatutPromo);
    const result = await controller.create(dto);
    expect(result).toEqual(mockStatutPromo);
    expect(statutPromoServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should update a statutPromo', async () => {
    const dto: UpdateStatutPromoDto = {
      libelle: 'User',
    };
    statutPromoServiceMock.update.mockResolvedValue({ ...mockStatutPromo, libelle: 'User' });
    const result = await controller.update('1', dto);
    expect(result.libelle).toBe('User');
    expect(statutPromoServiceMock.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove a statutPromo', async () => {
    statutPromoServiceMock.remove.mockResolvedValue(undefined);
    const result = await controller.remove('1');
    expect(result).toEqual({ message: 'statutPromo deleted successfully' });
    expect(statutPromoServiceMock.remove).toHaveBeenCalledWith('1');
  });
});