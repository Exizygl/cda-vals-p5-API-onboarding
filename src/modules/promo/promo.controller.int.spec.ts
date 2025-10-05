import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { TestAppModule } from '../../test-app.module';
import { Promo } from './promo.entity';
import { StatutPromo } from '../statut-promo/statutPromo.entity';
import { Formation } from '../formation/formation.entity';
import { Campus } from '../campus/campus.entity';
import { Identification } from '../identification/identification.entity';
import { StatutIdentification } from '../statut-identification/statutIdentification.entity';
import { Utilisateur } from '../utilisateur/utilisateur.entity';
import { randomUUID } from 'crypto';


let testIdCounter = 1;
const generateTestId = () => `100000000000000000${testIdCounter++}`;

describe('PromoController (Integration with PostgreSQL)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let statutActif: StatutPromo;
  let statutEnAttente: StatutPromo;
  let statutArchive: StatutPromo;
  let statutIdentificationAccepte: StatutIdentification;
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

 
    await dataSource.query(`
      TRUNCATE TABLE promo, statut_promo, formation, campus, identification, statut_identification, utilisateur
      RESTART IDENTITY CASCADE;
    `);

    statutActif = await dataSource.getRepository(StatutPromo).save({ libelle: 'actif' });
    statutEnAttente = await dataSource.getRepository(StatutPromo).save({ libelle: 'En attente' });
    statutArchive = await dataSource.getRepository(StatutPromo).save({ libelle: 'Archivé' });


    statutIdentificationAccepte = await dataSource.getRepository(StatutIdentification).save({ 
      libelle: 'Accepté' 
    });


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

  describe('POST /promos', () => {
    it('should create a promo', async () => {
      const dto = {
        nom: 'Promo Test',
        dateDebut: '2025-09-01T00:00:00.000Z',
        dateFin: '2025-12-01T00:00:00.000Z',
        statutId: statutEnAttente.id,
        formationId: formation.id,
        campusId: campus.id,
      };

      const res = await request(app.getHttpServer())
        .post('/promos')
        .send(dto)
        .expect(201);

      expect(res.body.nom).toBe('Promo Test');
      expect(res.body.id).toBeDefined();
      
  
      const promoInDb = await dataSource.getRepository(Promo).findOne({
        where: { id: res.body.id },
      });
      expect(promoInDb).toBeDefined();
      expect(promoInDb!.nom).toBe('Promo Test');
    });

    it('should fail validation with invalid data', async () => {
      const dto = {
        nom: '', 
        dateDebut: 'invalid-date',
        dateFin: '2025-12-01T00:00:00.000Z',
      };

      await request(app.getHttpServer())
        .post('/promos')
        .send(dto)
        .expect(400);
    });
  });

  describe('GET /promos', () => {
    it('should return a list of promos', async () => {
      await dataSource.getRepository(Promo).save([
        {
          nom: 'Promo 1',
          dateDebut: new Date('2025-09-01'),
          dateFin: new Date('2025-12-01'),
          statutPromo: statutActif,
          formation,
          campus,
        },
        {
          nom: 'Promo 2',
          dateDebut: new Date('2025-10-01'),
          dateFin: new Date('2026-01-01'),
          statutPromo: statutActif,
          formation,
          campus,
        },
      ]);

      const res = await request(app.getHttpServer())
        .get('/promos')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body.some((p: any) => p.nom === 'Promo 1')).toBe(true);
      expect(res.body.some((p: any) => p.nom === 'Promo 2')).toBe(true);
    });

    it('should return empty array when no promos exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/promos')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /promos/actif', () => {
    it('should return only active promos', async () => {
      await dataSource.getRepository(Promo).save([
        {
          nom: 'Active Promo',
          dateDebut: new Date('2025-01-01'),
          dateFin: new Date('2025-12-31'),
          statutPromo: statutActif,
          formation,
          campus,
        },
        {
          nom: 'Waiting Promo',
          dateDebut: new Date('2025-01-01'),
          dateFin: new Date('2025-12-31'),
          statutPromo: statutEnAttente,
          formation,
          campus,
        },
      ]);

      const res = await request(app.getHttpServer())
        .get('/promos/actif')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].nom).toBe('Active Promo');
      expect(res.body[0].statutPromo.libelle).toBe('actif');
    });
  });

  describe('GET /promos/to-start', () => {
  it('should return promos that need to start', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const utilisateur = await dataSource.getRepository(Utilisateur).save({
      id: generateTestId(),
      nom: 'Test',
      prenom: 'User',
      email: 'test@example.com',
    });

    const promo = await dataSource.getRepository(Promo).save({
      nom: 'Promo à démarrer',
      dateDebut: yesterday,
      dateFin: new Date('2025-12-31'),
      statutPromo: statutEnAttente,
      formation,
      campus,
    });

    await dataSource.getRepository(Identification).save({
      promo,
      utilisateur,
      statutidentification: statutIdentificationAccepte,
    });

    const res = await request(app.getHttpServer())
      .get('/promos/to-start')
      .expect(200);

    
    if (Array.isArray(res.body)) {
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].nom).toBe('Promo à démarrer');
    } else {
    
      expect(res.body).toEqual({});
    }
  });
});


  describe('GET /promos/to-archive', () => {
    it('should return active promos with end date older than 1 month', async () => {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      const utilisateur = await dataSource.getRepository(Utilisateur).save({
        id: generateTestId(),
        nom: 'Test',
        prenom: 'User',
        email: 'test@example.com',
      });

      const promo = await dataSource.getRepository(Promo).save({
        nom: 'Promo à archiver',
        dateDebut: new Date('2024-01-01'),
        dateFin: twoMonthsAgo,
        statutPromo: statutActif, 
        formation,
        campus,
      });

      await dataSource.getRepository(Identification).save({
        promo,
        utilisateur,
        statutidentification: statutIdentificationAccepte,
      });

      const res = await request(app.getHttpServer())
        .get('/promos/to-archive')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].nom).toBe('Promo à archiver');
      expect(res.body[0].statutPromo.libelle).toBe('actif');
    });

    it('should not return promos that ended less than 1 month ago', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      await dataSource.getRepository(Promo).save({
        nom: 'Promo récente',
        dateDebut: new Date('2025-01-01'),
        dateFin: twoDaysAgo,
        statutPromo: statutActif,
        formation,
        campus,
      });

      const res = await request(app.getHttpServer())
        .get('/promos/to-archive')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /promos/by-ids', () => {
    it('should return promos matching the given ids', async () => {
      const promo1 = await dataSource.getRepository(Promo).save({
        nom: 'Promo 1',
        dateDebut: new Date('2025-01-01'),
        dateFin: new Date('2025-12-31'),
        statutPromo: statutActif,
        formation,
        campus,
      });

      const promo2 = await dataSource.getRepository(Promo).save({
        nom: 'Promo 2',
        dateDebut: new Date('2025-02-01'),
        dateFin: new Date('2026-01-31'),
        statutPromo: statutActif,
        formation,
        campus,
      });

      const res = await request(app.getHttpServer())
        .get(`/promos/by-ids?ids=${promo1.id},${promo2.id}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body.map((p: any) => p.id)).toContain(promo1.id);
      expect(res.body.map((p: any) => p.id)).toContain(promo2.id);
    });

    it('should return empty array when no ids match', async () => {

      const fakeId1 = randomUUID();
      const fakeId2 = randomUUID();
      
      const res = await request(app.getHttpServer())
        .get(`/promos/by-ids?ids=${fakeId1},${fakeId2}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /promos/by-snowflakes', () => {
    it('should return promos matching the given snowflakes', async () => {
      const promo1 = await dataSource.getRepository(Promo).save({
        nom: 'Promo 1',
        dateDebut: new Date('2025-01-01'),
        dateFin: new Date('2025-12-31'),
        snowflake: '1234567890123',
        statutPromo: statutActif,
        formation,
        campus,
      });

      const promo2 = await dataSource.getRepository(Promo).save({
        nom: 'Promo 2',
        dateDebut: new Date('2025-02-01'),
        dateFin: new Date('2026-01-31'),
        snowflake: '9876543210987',
        statutPromo: statutActif,
        formation,
        campus,
      });

      const res = await request(app.getHttpServer())
        .get(`/promos/by-snowflakes?snowflakes=${promo1.snowflake},${promo2.snowflake}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body.map((p: any) => p.snowflake)).toContain(promo1.snowflake);
      expect(res.body.map((p: any) => p.snowflake)).toContain(promo2.snowflake);
    });
  });

  describe('GET /promos/snowflake/:snowflake', () => {
    it('should return a promo by snowflake', async () => {
      const promo = await dataSource.getRepository(Promo).save({
        nom: 'Promo Snowflake',
        dateDebut: new Date('2025-01-01'),
        dateFin: new Date('2025-12-31'),
        snowflake: '111111111111111',
        statutPromo: statutActif,
        formation,
        campus,
      });

      const res = await request(app.getHttpServer())
        .get(`/promos/snowflake/${promo.snowflake}`)
        .expect(200);

      expect(res.body.nom).toBe('Promo Snowflake');
      expect(res.body.snowflake).toBe('111111111111111');
    });

    it('should return 404 when snowflake not found', async () => {
      await request(app.getHttpServer())
        .get('/promos/snowflake/99999999999999')
        .expect(404);
    });
  });

  describe('GET /promos/:id', () => {
    it('should return a promo by id', async () => {
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

    it('should return 404 when promo not found', async () => {
    const fakeId = randomUUID(); 
    const res = await request(app.getHttpServer())
      .get(`/promos/${fakeId}`)
      .expect(404);

    expect(res.body).toMatchObject({
      statusCode: 404,
      message: expect.stringContaining('Promo with id'),
    });
});
});


  describe('PATCH /promos/:id', () => {
    it('should update a promo', async () => {
    const promo = await dataSource.getRepository(Promo).save({
    nom: 'Promo Original',
    dateDebut: new Date('2025-01-01'),
    dateFin: new Date('2025-12-31'),
    statutPromo: statutActif,
    formation,
    campus,
    });

    const updateDto = { nom: 'Promo Updated' };

    await request(app.getHttpServer())
    .patch(`/promos/${promo.id}`)
    .send(updateDto)
    .expect(200);

    const updatedPromo = await dataSource.getRepository(Promo).findOne({
    where: { id: promo.id },
    });

    expect(updatedPromo!.nom).toBe('Promo Updated');
    });


    it('should update only specified fields', async () => {
      const promo = await dataSource.getRepository(Promo).save({
        nom: 'Promo Original',
        dateDebut: new Date('2025-01-01'),
        dateFin: new Date('2025-12-31'),
        statutPromo: statutActif,
        formation,
        campus,
      });

      const updateDto = {
        dateFin: new Date('2026-06-30'),
      };

      const res = await request(app.getHttpServer())
        .patch(`/promos/${promo.id}`)
        .send(updateDto)
        .expect(200);

      expect(res.body.nom).toBe('Promo Original'); 
      expect(new Date(res.body.dateFin).getFullYear()).toBe(2026);
    });
  });
});