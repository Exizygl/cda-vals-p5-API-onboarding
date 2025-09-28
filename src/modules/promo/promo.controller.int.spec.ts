import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { TestAppModule } from '../../test-app.module';
import { Promo } from './promo.entity';
import { StatutPromo } from '../statut-promo/statutPromo.entity';

describe('PromoController (Integration with PostgreSQL)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = moduleFixture.get(DataSource);
     console.log('Entities loaded:', dataSource.entityMetadatas.map(e => e.name));

    // Wait until DB is ready
    let connected = false;
    for (let i = 0; i < 10 && !connected; i++) {
      try {
        await dataSource.query('SELECT 1');
        connected = true;
      } catch (err) {
        console.log(`Database not ready (attempt ${i + 1}), retrying...`);
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
    if (!connected) {
      throw new Error('Database connection could not be established');
    }
   
  });

  afterEach(async () => {
    // Clean tables between tests
    await dataSource.query(
      `TRUNCATE TABLE promo, statut_promo, formation, campus, identification RESTART IDENTITY CASCADE`
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('POST /promos should create a promo', async () => {
    const dto = {
      nom: 'Promo Test',
      dateDebut: '2025-09-01',
      dateFin: '2025-12-01',
    };

    const res = await request(app.getHttpServer())
      .post('/promos')
      .send(dto)
      .expect(201);

    expect(res.body.nom).toBe('Promo Test');
    expect(res.body.id).toBeDefined();
  });

  it('GET /promos should return a list', async () => {
    const res = await request(app.getHttpServer())
      .get('/promos')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /promos/:id should return a promo', async () => {
    const promoRepo = dataSource.getRepository(Promo);
    const promo = await promoRepo.save({
      nom: 'Promo DB',
      dateDebut: new Date('2025-09-01'),
      dateFin: new Date('2025-12-01'),
    });

    const res = await request(app.getHttpServer())
      .get(`/promos/${promo.id}`)
      .expect(200);

    expect(res.body.nom).toBe('Promo DB');
  });

  it('GET /promos/actif should return active promos', async () => {
    const promoRepo = dataSource.getRepository(Promo);
    const statutPromoRepo = dataSource.getRepository(StatutPromo);

    const statutActif = await statutPromoRepo.save({ libelle: 'actif' });

    await promoRepo.save({
      nom: 'Active Promo',
      dateDebut: new Date('2025-01-01'),
      dateFin: new Date('2025-12-31'),
      statutPromo: statutActif,
    });

    const res = await request(app.getHttpServer())
      .get('/promos/actif')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((p) => p.nom === 'Active Promo')).toBe(true);
  });
});
