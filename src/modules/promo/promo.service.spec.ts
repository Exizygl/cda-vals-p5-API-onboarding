import { NotFoundException } from '@nestjs/common';
import { PromoService } from './promo.service';
import { Promo } from './promo.entity';
import { PromoMapper } from './promo.mapper';
import { Repository } from 'typeorm';
import { IStatutPromoService } from '../statut-promo/interface/IStatutPromoService';


type MockType<T> = {
  [P in keyof T]: jest.Mock<any, any>;
};


const createMockRepo = (): MockType<Repository<any>> => ({
  find: jest.fn(),
  findBy: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
} as any);

describe('PromoService', () => {
  let service: PromoService;
  let repo: MockType<Repository<Promo>>;
  let statutPromoService: jest.Mocked<IStatutPromoService>;

beforeEach(() => {
  repo = createMockRepo();

  statutPromoService = {
    findByLibelle: jest.fn(),
  } as Partial<jest.Mocked<IStatutPromoService>> as jest.Mocked<IStatutPromoService>;

  service = new PromoService(repo as any, statutPromoService);
});

  describe('findOne', () => {
    it('should return a promo when found', async () => {
      const promo = { id: '1' } as Promo;
      repo.findOne.mockResolvedValue(promo);

      const result = await service.findOne('1');
      expect(result).toEqual(promo);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneBySnowflake', () => {
    it('should return a promo when found', async () => {
      const promo = { snowflake: 'abc' } as Promo;
      repo.findOne.mockResolvedValue(promo);

      const result = await service.findOneBySnowflake('abc');
      expect(result).toEqual(promo);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { snowflake: 'abc' } });
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOneBySnowflake('abc')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a promo with "En attente" status', async () => {
      const dto = { nom: 'Promo 1' } as any;
      const statut = { id: 'statut1' } as any;
      const promoEntity = { id: 'promo1' } as Promo;

      statutPromoService.findByLibelle.mockResolvedValue(statut);
      jest.spyOn(PromoMapper, 'fromCreateDto').mockReturnValue(promoEntity);
      repo.save.mockResolvedValue(promoEntity);

      const result = await service.create(dto);
      expect(statutPromoService.findByLibelle).toHaveBeenCalledWith('En attente');
      expect(PromoMapper.fromCreateDto).toHaveBeenCalledWith(dto, statut);
      expect(repo.save).toHaveBeenCalledWith(promoEntity);
      expect(result).toEqual(promoEntity);
    });

    it('should throw an error if "En attente" status is not found', async () => {
      statutPromoService.findByLibelle.mockResolvedValue(null);

      await expect(service.create({} as any)).rejects.toThrow(
        'Statut "En attente" not found',
      );
    });
  });

  describe('update', () => {
    it('should save the promo with given id', async () => {
      const dto = { nom: 'Updated Promo' } as any;
      const updatedPromo = { id: '1', ...dto } as Promo;

      repo.save.mockResolvedValue(updatedPromo);

      const result = await service.update('1', dto);
      expect(repo.save).toHaveBeenCalledWith({ ...dto, id: '1' });
      expect(result).toEqual(updatedPromo);
    });
  });
});
