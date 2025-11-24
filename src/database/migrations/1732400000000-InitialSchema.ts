import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1732400000000 implements MigrationInterface {
  name = 'InitialSchema1732400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Table: statut_promo
    await queryRunner.query(`
      CREATE TABLE "statut_promo" (
        "id_statut_promo" SMALLSERIAL PRIMARY KEY,
        "libelle_statut_promo" VARCHAR(50) NOT NULL,
        "date_creation_statut_promo" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "date_modification_statut_promo" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Table: statut_identification
    await queryRunner.query(`
      CREATE TABLE "statut_identification" (
        "id_statut_identification" SMALLSERIAL PRIMARY KEY,
        "libelle_statut_identification" VARCHAR(50) NOT NULL,
        "date_creation_statut_identification" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "date_modification_statut_identification" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Table: campus
    await queryRunner.query(`
      CREATE TABLE "campus" (
        "id_campus" BIGINT PRIMARY KEY,
        "nom_campus" VARCHAR(100) NOT NULL,
        "actif_campus" BOOLEAN NOT NULL,
        "date_creation_campus" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "date_modification_campus" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Table: formation
    await queryRunner.query(`
      CREATE TABLE "formation" (
        "id_formation" BIGINT PRIMARY KEY,
        "nom_formation" VARCHAR(100) NOT NULL,
        "actif_formation" BOOLEAN NOT NULL,
        "date_creation_formation" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "date_modification_formation" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Table: role
    await queryRunner.query(`
      CREATE TABLE "role" (
        "id_role" BIGINT PRIMARY KEY,
        "nom_role" VARCHAR(100) NOT NULL,
        "selectionnable_role" BOOLEAN NOT NULL,
        "date_creation_role" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "date_modification_role" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Table: utilisateur
    await queryRunner.query(`
      CREATE TABLE "utilisateur" (
        "id_utilisateur" BIGINT PRIMARY KEY,
        "nom_utilisateur" VARCHAR(100) NOT NULL,
        "prenom_utilisateur" VARCHAR(100) NOT NULL,
        "date_creation_utilisateur" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "date_modification_utilisateur" TIMESTAMPTZ NULL
      )
    `);

    // Table: promo
    await queryRunner.query(`
      CREATE TABLE "promo" (
        "id_promo" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "nom_promo" VARCHAR(100) NOT NULL,
        "date_debut_promo" DATE NOT NULL,
        "date_fin_promo" DATE NOT NULL,
        "snowflake_promo" BIGINT NULL UNIQUE,
        "date_creation_promo" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "date_modification_promo" TIMESTAMPTZ NULL,
        "id_statut_promo" SMALLINT NOT NULL,
        "id_formation" BIGINT NOT NULL,
        "id_campus" BIGINT NOT NULL,
        CONSTRAINT "FK_promo_statut" FOREIGN KEY ("id_statut_promo") REFERENCES "statut_promo"("id_statut_promo") ON DELETE RESTRICT,
        CONSTRAINT "FK_promo_formation" FOREIGN KEY ("id_formation") REFERENCES "formation"("id_formation") ON DELETE RESTRICT,
        CONSTRAINT "FK_promo_campus" FOREIGN KEY ("id_campus") REFERENCES "campus"("id_campus") ON DELETE RESTRICT
      )
    `);

    // Table: identification
    await queryRunner.query(`
      CREATE TABLE "identification" (
        "id_identification" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "date_creation_identification" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "date_modification_identification" TIMESTAMPTZ NULL,
        "id_statut_identification" SMALLINT NOT NULL,
        "id_promo" UUID NOT NULL,
        "id_utilisateur" BIGINT NOT NULL,
        CONSTRAINT "FK_identification_statut" FOREIGN KEY ("id_statut_identification") REFERENCES "statut_identification"("id_statut_identification") ON DELETE RESTRICT,
        CONSTRAINT "FK_identification_promo" FOREIGN KEY ("id_promo") REFERENCES "promo"("id_promo") ON DELETE CASCADE,
        CONSTRAINT "FK_identification_utilisateur" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE
      )
    `);

    // Table de liaison: utilisateur_role
    await queryRunner.query(`
      CREATE TABLE "utilisateur_role" (
        "id_utilisateur" BIGINT NOT NULL,
        "id_role" BIGINT NOT NULL,
        PRIMARY KEY ("id_utilisateur", "id_role"),
        CONSTRAINT "FK_utilisateur_role_utilisateur" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE,
        CONSTRAINT "FK_utilisateur_role_role" FOREIGN KEY ("id_role") REFERENCES "role"("id_role") ON DELETE CASCADE
      )
    `);

    // Index pour améliorer les performances
    await queryRunner.query(`CREATE INDEX "IDX_promo_snowflake" ON "promo"("snowflake_promo")`);
    await queryRunner.query(`CREATE INDEX "IDX_promo_statut" ON "promo"("id_statut_promo")`);
    await queryRunner.query(`CREATE INDEX "IDX_promo_dates" ON "promo"("date_debut_promo", "date_fin_promo")`);
    await queryRunner.query(`CREATE INDEX "IDX_identification_statut" ON "identification"("id_statut_identification")`);
    await queryRunner.query(`CREATE INDEX "IDX_identification_promo" ON "identification"("id_promo")`);
    await queryRunner.query(`CREATE INDEX "IDX_identification_utilisateur" ON "identification"("id_utilisateur")`);

    console.log('✅ Schema initial créé');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Suppression dans l'ordre inverse (à cause des foreign keys)
    await queryRunner.query(`DROP TABLE IF EXISTS "utilisateur_role" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "identification" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "promo" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "utilisateur" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "formation" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "campus" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "statut_identification" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "statut_promo" CASCADE`);

    console.log('✅ Schema initial supprimé');
  }
}