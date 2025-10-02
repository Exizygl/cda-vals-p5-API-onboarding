import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { TestAppModule } from '../../test-app.module';
import { Promo } from './promo.entity';
import { StatutPromo } from '../statut-promo/statutPromo.entity';
import { Formation } from '../formation/formation.entity';
import { Campus } from '../campus/campus.entity';

// Helper pour générer des Snowflakes Discord fictifs pour les tests
class TestDiscordHelper {
  private static counter = 0;

  static generateSnowflake(): string {
    const timestamp = Date.now() - 1420070400000; // Discord epoch
    const counter = this.counter++;
    return `${timestamp}${String(counter).padStart(5, '0')}`;
  }
}

describe('PromoController (Integration with PostgreSQL)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let statutActif: StatutPromo;
  let formation: Formation;
  let campus: Campus;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
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
    // Nettoyer les tables avant chaque test
    await dataSource.query(`
      TRUNCATE TABLE promo, statut_promo, formation, campus, identification 
      RESTART IDENTITY CASCADE;
    `);

    // Créer un StatutPromo "actif" par défaut
    statutActif = await dataSource.getRepository(StatutPromo).save({ libelle: 'actif' });

    // Créer une Formation avec un Snowflake Discord fictif
    formation = await dataSource.getRepository(Formation).save({
      id: TestDiscordHelper.generateSnowflake(),
      nom: 'Formation Test',
      actif: true,
    });

    // Créer un Campus (ajouter id si Campus utilise aussi des Snowflakes)
    campus = await dataSource.getRepository(Campus).save({
      nom: 'Campus Test'
    });
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
      statutPromoId: statutActif.id,
      idFormation: formation.id, 
      idCampus: campus.id,   
    };

    const res = await request(app.getHttpServer())
      .post('/promos')
      .send(dto)
      .expect(201);

    expect(res.body.nom).toBe('Promo Test');
    expect(res.body.id).toBeDefined();
    expect(res.body.formation.id).toBe(formation.id);
    expect(res.body.campus.id).toBe(campus.id);
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
    expect(res.body.formation.id).toBe(formation.id);
    expect(res.body.campus.id).toBe(campus.id);
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