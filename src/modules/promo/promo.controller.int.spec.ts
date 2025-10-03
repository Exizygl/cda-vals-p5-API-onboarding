import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { TestAppModule } from '../../test-app.module';
import { Promo } from './promo.entity';
import { StatutPromo } from '../statut-promo/statutPromo.entity';
import { Formation } from '../formation/formation.entity';
import { Campus } from '../campus/campus.entity';

// Helper pour générer des IDs de test simulant des Snowflakes
let testIdCounter = 1;
const generateTestId = () => `100000000000000000${testIdCounter++}`;

describe('PromoController (Integration with PostgreSQL)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let statutActif: StatutPromo;
  let statutEnAttente: StatutPromo;
  let formation: Formation;
  let campus: Campus;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true,
      transform: true,
    }));
    await app.init();

    dataSource = moduleFixture.get(DataSource);

    // Attendre que la DB soit prête
    let connected = false;
    for (let i = 0; i < 10 && !connected; i++) {
      try {
        await dataSource.query('SELECT 1');
        connected = true;
      } catch (err) {
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
    if (!connected) {
      throw new Error('Database connection could not be established');
    }
  });

  beforeEach(async () => {
    testIdCounter = 1;

    // Nettoyer les tables
    await dataSource.query(`
      TRUNCATE TABLE promo, statut_promo, formation, campus, identification 
      RESTART IDENTITY CASCADE;
    `);

    // Statuts
    statutActif = await dataSource.getRepository(StatutPromo).save({ libelle: 'actif' });
    statutEnAttente = await dataSource.getRepository(StatutPromo).save({ libelle: 'En attente' });

    // Formation et Campus
    formation = await dataSource.getRepository(Formation).save({ 
      id: generateTestId(),
      nom: 'Formation Test',
      actif: true
    });
    campus = await dataSource.getRepository(Campus).save({ 
      id: generateTestId(),
      nom: 'Campus Test',
      actif: true
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('POST /promos should create a promo', async () => {
    const dto = {
      nom: 'Promo Test',
      dateDebut: '2025-09-01T00:00:00.000Z',
      dateFin: '2025-12-01T00:00:00.000Z',
      statutId: statutEnAttente.id,  // statut "En attente"
      formationId: formation.id,
      campusId: campus.id,
    };

    const res = await request(app.getHttpServer())
      .post('/promos')
      .send(dto);

    console.log('STATUS:', res.status);
    console.log('BODY:', res.body);

    expect(res.status).toBe(201);
    expect(res.body.nom).toBe('Promo Test');
    expect(res.body.id).toBeDefined();
  });

  it('GET /promos should return a list', async () => {
    await dataSource.getRepository(Promo).save({
      nom: 'Promo DB',
      dateDebut: new Date('2025-09-01'),
      dateFin: new Date('2025-12-01'),
      statutPromo: statutActif,
      formation,
      campus,
    });

    const res = await request(app.getHttpServer())
      .get('/promos')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /promos/:id should return a promo', async () => {
    const promo = await dataSource.getRepository(Promo).save({
      nom: 'Promo DB',
      dateDebut: new Date('2025-09-01'),
      dateFin: new Date('2025-12-01'),
      statutPromo: statutActif,
      formation,
      campus,
    });

    const res = await request(app.getHttpServer())
      .get(`/promos/${promo.id}`)
      .expect(200);

    expect(res.body.nom).toBe('Promo DB');
    expect(res.body.id).toBe(promo.id);
  });

  it('GET /promos/actif should return active promos', async () => {
    await dataSource.getRepository(Promo).save({
      nom: 'Active Promo',
      dateDebut: new Date('2025-01-01'),
      dateFin: new Date('2025-12-31'),
      statutPromo: statutActif,
      formation,
      campus,
    });

    const res = await request(app.getHttpServer())
      .get('/promos/actif')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((p) => p.nom === 'Active Promo')).toBe(true);
  });
});
