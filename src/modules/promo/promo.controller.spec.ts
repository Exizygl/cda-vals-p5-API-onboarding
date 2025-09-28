import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { Promo } from './promo.entity';
import { PromoController } from './promo.controller';
import { PromoService } from './promo.service';
import { StatutPromo } from '../statut-promo/statutPromo.entity';
import { Formation } from '../formation/formation.entity';
import { Campus } from '../campus/campus.entity';
import { Identification } from '../identification/identification.entity';
import { IStatutPromoServiceToken } from '../statut-promo/statutPromo.constants';
import { IStatutPromoService } from '../statut-promo/interface/IStatutPromoService';

describe('PromoController (Integration with PostgreSQL)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const fakeStatutPromoService: Partial<IStatutPromoService> = {
    findByLibelle: async (libelle: string): Promise<StatutPromo> => {
      return { id: 1, libelle } as StatutPromo;
    },
  };

  beforeAll(async () => {
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: true,
          dropSchema: true,
          autoLoadEntities: true,
        }),
        TypeOrmModule.forFeature([Promo, StatutPromo, Formation, Campus, Identification]),
      ],
      controllers: [PromoController],
      providers: [
        PromoService,
        { provide: IStatutPromoServiceToken, useValue: fakeStatutPromoService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('POST /promos should create a promo', async () => {
    const formationRepo = dataSource.getRepository(Formation);
    const campusRepo = dataSource.getRepository(Campus);
    const statutPromoRepo = dataSource.getRepository(StatutPromo);

    const formation = await formationRepo.save({ nom: 'Formation Test' });
    const campus = await campusRepo.save({ nom: 'Campus Test' });
    const statut = await statutPromoRepo.save({ libelle: 'actif' });

    const dto = {
      nom: 'Promo Test',
      dateDebut: '2025-09-01',
      dateFin: '2025-12-01',
      formationId: formation.id,
      campusId: campus.id,
      statutPromoId: statut.id,
    };

    const res = await request(app.getHttpServer())
      .post('/promos')
      .send(dto)
      .expect(201);

    expect(res.body.nom).toBe('Promo Test');
    expect(res.body.id).toBeDefined();
  });

  it('GET /promos should return a list', async () => {
    const res = await request(app.getHttpServer()).get('/promos').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /promos/:id should return a promo', async () => {
    const promoRepo = dataSource.getRepository(Promo);
    const formationRepo = dataSource.getRepository(Formation);
    const campusRepo = dataSource.getRepository(Campus);
    const statutPromoRepo = dataSource.getRepository(StatutPromo);

    const formation = await formationRepo.save({ nom: 'Formation DB' });
    const campus = await campusRepo.save({ nom: 'Campus DB' });
    const statut = await statutPromoRepo.save({ libelle: 'actif' });

    const promo = await promoRepo.save({
      nom: 'Promo DB',
      dateDebut: new Date('2025-09-01'),
      dateFin: new Date('2025-12-01'),
      formation,
      campus,
      statutPromo: statut,
    });

    const res = await request(app.getHttpServer())
      .get(`/promos/${promo.id}`)
      .expect(200);

    expect(res.body.nom).toBe('Promo DB');
  });

  it('GET /promos/actif should return active promos', async () => {
    const promoRepo = dataSource.getRepository(Promo);
    const statutPromoRepo = dataSource.getRepository(StatutPromo);
    const formationRepo = dataSource.getRepository(Formation);
    const campusRepo = dataSource.getRepository(Campus);

    const formation = await formationRepo.save({ nom: 'Formation Active' });
    const campus = await campusRepo.save({ nom: 'Campus Active' });
    const statutActif = await statutPromoRepo.save({ libelle: 'actif' });

    await promoRepo.save({
      nom: 'Active Promo',
      dateDebut: new Date('2025-01-01'),
      dateFin: new Date('2025-12-31'),
      formation,
      campus,
      statutPromo: statutActif,
    });

    const res = await request(app.getHttpServer())
      .get('/promos/actif')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((p) => p.nom === 'Active Promo')).toBe(true);
  });
});
