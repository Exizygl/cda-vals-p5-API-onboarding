import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1732400000001 implements MigrationInterface {
  name = 'SeedInitialData1732400000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Seeding initial data...');


    await queryRunner.query(`
      INSERT INTO "statut_promo" ("libelle_statut_promo")
      VALUES 
        ('en attente'),
        ('actif'),
        ('archivée')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Statuts Promo seedés');

    await queryRunner.query(`
      INSERT INTO "statut_identification" ("libelle_statut_identification")
      VALUES 
        ('en attente'),
        ('accepté'),
        ('refusée')
      ON CONFLICT DO NOTHING
    `);
    console.log('Statuts Identification seedés');

    console.log('Initial data seeding completed!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "statut_identification"`);
    await queryRunner.query(`DELETE FROM "statut_promo"`);
    
    console.log('Initial data removed');
  }
}