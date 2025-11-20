import { Test, TestingModule } from '@nestjs/testing';
import { IdentificationService } from './identification.service';
import { Identification } from './identification.entity';
import { StatutIdentification } from '../statut-identification/statutIdentification.entity';
import { Promo } from '../promo/promo.entity';
import { Utilisateur } from '../utilisateur/utilisateur.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

type Mockify<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any
    ? jest.Mock<ReturnType<T[P]>, Parameters<T[P]>>
    : never;
};
type MockType<T> = Partial<Mockify<T>>;

const createMockRepo = <T extends ObjectLiteral>(): MockType<Repository<T>> => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('IdentificationService', () => {
  let service: IdentificationService;
  let identificationRepo: MockType<Repository<Identification>>;
  let statutRepo: MockType<Repository<StatutIdentification>>;
  let promoRepo: MockType<Repository<Promo>>;
  let utilisateurRepo: MockType<Repository<Utilisateur>>;

  beforeEach(async () => {
    identificationRepo = createMockRepo<Identification>();
    statutRepo = createMockRepo<StatutIdentification>();
    promoRepo = createMockRepo<Promo>();
    utilisateurRepo = createMockRepo<Utilisateur>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentificationService,
        {
          provide: getRepositoryToken(Identification),
          useValue: identificationRepo,
        },
        {
          provide: getRepositoryToken(StatutIdentification),
          useValue: statutRepo,
        },
        { provide: getRepositoryToken(Promo), useValue: promoRepo },
        { provide: getRepositoryToken(Utilisateur), useValue: utilisateurRepo },
      ],
    }).compile();

    service = module.get<IdentificationService>(IdentificationService);
  });

  describe('create', () => {
    it('should create identification successfully', async () => {
      const dto = { promoId: 'p1', utilisateurId: 'u1' };
      const statut: StatutIdentification = {
        id: 1,
        libelle: 'En attente',
        dateCreation: new Date(),
        dateModification: new Date(),
      };
      const promo: Promo = { id: 'p1' } as Promo;
      const utilisateur: Utilisateur = { id: 'u1' } as Utilisateur;
      const identification: Identification = { id: 'i1' } as Identification;

      statutRepo.findOneBy!.mockResolvedValue(statut);
      promoRepo.findOneBy!.mockResolvedValue(promo);
      utilisateurRepo.findOneBy!.mockResolvedValue(utilisateur);
      identificationRepo.create!.mockReturnValue(identification);
      identificationRepo.save!.mockResolvedValue(identification);

      const result = await service.create(dto as any);

      expect(statutRepo.findOneBy).toHaveBeenCalledWith({
        libelle: 'en attente',
      });
      expect(promoRepo.findOneBy).toHaveBeenCalledWith({ id: 'p1' });
      expect(utilisateurRepo.findOneBy).toHaveBeenCalledWith({ id: 'u1' });
      expect(identificationRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          promo,
          utilisateur,
          statutIdentification: statut,
        }),
      );
      expect(result).toBe(identification);
    });
  });

  describe('update', () => {
    it('should update statut and save', async () => {
      const existing: Identification = {
        id: 'i',
        statutIdentification: {} as StatutIdentification,
      } as Identification;
      const statut: StatutIdentification = {
        id: 2,
        libelle: 'Validé',
        dateCreation: new Date(),
        dateModification: new Date(),
      };

      jest.spyOn(service, 'findById').mockResolvedValue(existing);
      statutRepo.findOneBy!.mockResolvedValue(statut);
      identificationRepo.save!.mockResolvedValue({
        ...existing,
        statutIdentification: statut,
      });

      const result = await service.update('i1', {
        statutIdentificationId: 2,
      } as any);

      expect(statutRepo.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(identificationRepo.save).toHaveBeenCalledWith({
        ...existing,
        statutIdentification: statut,
      });
      expect(result.statutIdentification).toBe(statut);
    });

    it('should throw if statut not found', async () => {
      jest
        .spyOn(service, 'findById')
        .mockResolvedValue({ id: 'i1' } as Identification);
      statutRepo.findOneBy!.mockResolvedValue(null);

      await expect(
        service.update('i1', { statutIdentificationId: 999 } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
