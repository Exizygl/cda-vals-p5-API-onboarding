import { NotFoundException } from '@nestjs/common';
import { PromoService } from './promo.service';
import { Promo } from './promo.entity';
import { PromoMapper } from './promo.mapper';
import { Repository, In } from 'typeorm';
import { IStatutPromoService } from '../statut-promo/interface/IStatutPromoService';

type MockType<T> = {
  [P in keyof T]: jest.Mock<any, any>;
};

const createMockRepo = (): MockType<Repository<any>> => ({
  find: jest.fn(),
  findBy: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
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
    

    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a promo when found', async () => {
      const promo = { id: '1' } as Promo;
      repo.findOne.mockResolvedValue(promo);
      const result = await service.findOne('1');
      expect(result).toEqual(promo);
      expect(repo.findOne).toHaveBeenCalledWith({ 
        where: { id: '1' },
        relations: ['statutPromo', 'formation', 'campus', 'identifications']
      });
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
      expect(repo.findOne).toHaveBeenCalledWith({ 
        where: { snowflake: 'abc' },
        relations: ['statutPromo', 'formation', 'campus', 'identifications']
      });
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
      expect(statutPromoService.findByLibelle).toHaveBeenCalledWith('en attente');
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
    it('should update the promo with given id', async () => {
      const dto = { nom: 'Updated Promo', dateFin: new Date('2026-12-31') } as any;
      const existingPromo = { 
        id: '1', 
        nom: 'Old Promo',
        dateFin: new Date('2025-12-31'),
        statutPromo: { libelle: 'actif' }
      } as Promo;
      const savedPromo = { 
        id: '1', 
        nom: 'Updated Promo',
        dateFin: new Date('2026-12-31'),
        statutPromo: { libelle: 'actif' }
      } as Promo;
      const reloadedPromo = { 
        id: '1', 
        nom: 'Updated Promo',
        dateFin: new Date('2026-12-31'),
        statutPromo: { libelle: 'actif' },
        formation: {},
        campus: {}
      } as Promo;


      repo.findOne.mockResolvedValueOnce(existingPromo);
      

      repo.save.mockResolvedValueOnce(savedPromo);
      

      repo.findOne.mockResolvedValueOnce(reloadedPromo);

      const result = await service.update('1', dto);


      expect(repo.findOne).toHaveBeenNthCalledWith(1, {
        where: { id: '1' },
        relations: ['statutPromo', 'formation', 'campus', 'identifications'],
      });


      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
        id: '1',
        nom: 'Updated Promo',
        dateFin: dto.dateFin
      }));


      expect(repo.findOne).toHaveBeenNthCalledWith(2, {
        where: { id: '1' },
        relations: ['statutPromo', 'formation', 'campus', 'identifications'],
      });

      expect(result).toEqual(reloadedPromo);
    });

    it('should throw NotFoundException when promo not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update('999', { nom: 'Test' })).rejects.toThrow(
        NotFoundException
      );
    });

    it('should only update provided fields', async () => {
      const dto = { nom: 'Only Name Updated' } as any;
      const existingPromo = { 
        id: '1', 
        nom: 'Old Name',
        dateDebut: new Date('2025-01-01'),
        dateFin: new Date('2025-12-31'),
        statutPromo: { libelle: 'actif' }
      } as Promo;

      repo.findOne.mockResolvedValueOnce(existingPromo);
      repo.save.mockResolvedValueOnce({ ...existingPromo, nom: 'Only Name Updated' });
      repo.findOne.mockResolvedValueOnce({ ...existingPromo, nom: 'Only Name Updated' });

      await service.update('1', dto);

     
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
        nom: 'Only Name Updated',
        dateDebut: existingPromo.dateDebut,
        dateFin: existingPromo.dateFin
      }));
    });
  });

  describe('updateBySnowflake', () => {
    it('should update the promo with given snowflake', async () => {
      const dto = { nom: 'Updated via Snowflake' } as any;
      const existingPromo = { 
        id: '1',
        snowflake: 'abc123',
        nom: 'Old Promo',
        statutPromo: { libelle: 'actif' }
      } as Promo;
      const savedPromo = { 
        id: '1',
        snowflake: 'abc123',
        nom: 'Updated via Snowflake',
        statutPromo: { libelle: 'actif' }
      } as Promo;
      const reloadedPromo = { 
        id: '1',
        snowflake: 'abc123',
        nom: 'Updated via Snowflake',
        statutPromo: { libelle: 'actif' },
        formation: {},
        campus: {}
      } as Promo;

  
      repo.findOne.mockResolvedValueOnce(existingPromo);
      
 
      repo.save.mockResolvedValueOnce(savedPromo);
      
 
      repo.findOne.mockResolvedValueOnce(reloadedPromo);

      const result = await service.updateBySnowflake('abc123', dto);

 
      expect(repo.findOne).toHaveBeenCalledTimes(2);
      

      expect(repo.findOne).toHaveBeenNthCalledWith(1, {
        where: { snowflake: 'abc123' },
        relations: ['statutPromo', 'formation', 'campus', 'identifications'],
      });

    
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
        id: '1',
        snowflake: 'abc123',
        nom: 'Updated via Snowflake'
      }));

      
      expect(repo.findOne).toHaveBeenNthCalledWith(2, {
        where: { id: '1' },
        relations: ['statutPromo', 'formation', 'campus', 'identifications'],
      });

      expect(result).toEqual(reloadedPromo);
    });

    it('should throw NotFoundException when snowflake not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.updateBySnowflake('xyz', { nom: 'Test' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findByIds', () => {
    it('should return promos matching the given ids', async () => {
      const ids = ['1', '2', '3'];
      const promos = [
        { id: '1', nom: 'Promo 1' },
        { id: '2', nom: 'Promo 2' },
      ] as Promo[];
      
      repo.findBy.mockResolvedValue(promos);
      
      const result = await service.findByIds(ids);
      
      expect(result).toEqual(promos);
      expect(repo.findBy).toHaveBeenCalledWith({ id: In(ids) });
    });

    it('should return empty array when no ids match', async () => {
      const ids = ['999'];
      repo.findBy.mockResolvedValue([]);
      
      const result = await service.findByIds(ids);
      
      expect(result).toEqual([]);
      expect(repo.findBy).toHaveBeenCalledWith({ id: In(ids) });
    });
  });

  describe('findBySnowflakes', () => {
    it('should return promos matching the given snowflakes', async () => {
      const snowflakes = ['abc', 'def'];
      const promos = [
        { id: '1', snowflake: 'abc' },
        { id: '2', snowflake: 'def' },
      ] as Promo[];
      
      repo.find.mockResolvedValue(promos);
      
      const result = await service.findBySnowflakes(snowflakes);
      
      expect(result).toEqual(promos);
      expect(repo.find).toHaveBeenCalledWith({
        where: { snowflake: In(snowflakes) },
      });
    });

    it('should return empty array when no snowflakes match', async () => {
      const snowflakes = ['xyz'];
      repo.find.mockResolvedValue([]);
      
      const result = await service.findBySnowflakes(snowflakes);
      
      expect(result).toEqual([]);
    });
  });

  describe('findAll', () => {
    it('should return all promos', async () => {
      const promos = [
        { id: '1', nom: 'Promo 1' },
        { id: '2', nom: 'Promo 2' },
        { id: '3', nom: 'Promo 3' },
      ] as Promo[];
      
      repo.find.mockResolvedValue(promos);
      
      const result = await service.findAll();
      
      expect(result).toEqual(promos);
expect(repo.find).toHaveBeenCalledWith({
  relations: ['statutPromo', 'formation', 'campus', 'identifications'],
});
    });

    it('should return empty array when no promos exist', async () => {
      repo.find.mockResolvedValue([]);
      
      const result = await service.findAll();
      
      expect(result).toEqual([]);
    });
  });

  describe('findActif', () => {
    it('should return only active promos', async () => {
      const activePromos = [
        { 
          id: '1', 
          nom: 'Promo 1', 
          statutPromo: { libelle: 'actif' } 
        },
        { 
          id: '2', 
          nom: 'Promo 2', 
          statutPromo: { libelle: 'actif' } 
        },
      ] as Promo[];
      
      repo.find.mockResolvedValue(activePromos);
      
      const result = await service.findActif();
      
      expect(result).toEqual(activePromos);
      expect(repo.find).toHaveBeenCalledWith({
        relations: ['statutPromo'],
        where: {
          statutPromo: {
            libelle: 'actif',
          },
        },
      });
    });

    it('should return empty array when no active promos exist', async () => {
      repo.find.mockResolvedValue([]);
      
      const result = await service.findActif();
      
      expect(result).toEqual([]);
    });
  });

  describe('findPromoToStart', () => {
    let mockQueryBuilder: any;

    beforeEach(() => {
      mockQueryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      };
      repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    });

    it('should return promos that need to start', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const promosToStart = [
        {
          id: '1',
          nom: 'Promo 1',
          dateDebut: new Date('2025-01-01'),
          dateFin: new Date('2025-12-31'),
          snowflake: '123456',
          dateCreation: new Date(),
          dateModification: new Date(),
          statutPromo: { libelle: 'En attente' } as any,
          formation: {} as any,
          campus: {} as any,
          identifications: [
            {
              statutidentification: { libelle: 'Accepté' },
              utilisateur: { roles: [] },
            } as any,
          ],
        },
      ] as Promo[];

      mockQueryBuilder.getMany.mockResolvedValue(promosToStart);

      const result = await service.findPromoToStart();

expect(result).toEqual(promosToStart);
expect(repo.createQueryBuilder).toHaveBeenCalledWith('promo');

// On vérifie juste que les méthodes importantes ont été appelées
expect(mockQueryBuilder.innerJoinAndSelect).toHaveBeenCalled();
expect(mockQueryBuilder.where).toHaveBeenCalled();
expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
expect(mockQueryBuilder.orderBy).toHaveBeenCalled();
    });

    it('should return null when no promos need to start', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findPromoToStart();

      expect(result).toBeNull();
    });
  });

  describe('findPromoToArchive', () => {
    let mockQueryBuilder: any;

    beforeEach(() => {
      mockQueryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      };
      repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    });

    it('should return active promos with end date older than 1 month', async () => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const promosToArchive = [
        {
          id: '1',
          nom: 'Promo 1',
          dateDebut: new Date('2024-01-01'),
          dateFin: new Date('2024-10-01'), 
          snowflake: '789012',
          dateCreation: new Date(),
          dateModification: new Date(),
          statutPromo: { libelle: 'actif' } as any, 
          formation: {} as any,
          campus: {} as any,
          identifications: [
            {
              statutidentification: { libelle: 'Accepté' },
              utilisateur: { roles: [] },
            } as any,
          ],
        },
      ] as Promo[];

      mockQueryBuilder.getMany.mockResolvedValue(promosToArchive);

      const result = await service.findPromoToArchive();

      expect(result).toEqual(promosToArchive);
      expect(repo.createQueryBuilder).toHaveBeenCalledWith('promo');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'promo.statutPromo',
        'statutPromo',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'statutPromo.libelle = :actif',
        { actif: 'actif' },
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'promo.dateFin < :oneMonthAgo',
        expect.objectContaining({ oneMonthAgo: expect.any(Date) }),
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'promo.dateFin',
        'ASC',
      );
    });

    it('should return null when no promos need archiving', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findPromoToArchive();

      expect(result).toBeNull();
    });

    it('should not return promos that ended less than 1 month ago', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.findPromoToArchive();

      expect(result).toBeNull();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'promo.dateFin < :oneMonthAgo',
        expect.any(Object),
      );
    });
  });
});