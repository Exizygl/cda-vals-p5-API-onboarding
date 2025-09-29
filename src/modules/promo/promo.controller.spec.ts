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

describe('PromoController (Integration with PostgreSQL)', () => {
let app: INestApplication;
let dataSource: DataSource;
let statutActif: StatutPromo;

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
const statutPromoRepo = dataSource.getRepository(StatutPromo);
statutActif = await statutPromoRepo.save({ libelle: 'actif' });


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
statutPromoId: statutActif.id, // on utilise le statut créé en beforeEach
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
statutPromo: statutActif,
});

const res = await request(app.getHttpServer())
  .get(`/promos/${promo.id}`)
  .expect(200);

expect(res.body.nom).toBe('Promo DB');


});

it('GET /promos/actif should return active promos', async () => {
const promoRepo = dataSource.getRepository(Promo);

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