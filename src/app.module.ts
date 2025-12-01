import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler'; // ← AJOUTE
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilisateurModule } from './modules/utilisateur/utilisateur.module';
import { RoleModule } from './modules/role/role.module';
import { IdentificationModule } from './modules/identification/identification.module';
import { FormationModule } from './modules/formation/formation.module';
import { CampusModule } from './modules/campus/campus.module';
import { StatutIdentificationModule } from './modules/statut-identification/statutIdentification.module';
import { StatutPromoModule } from './modules/statut-promo/statutPromo.module';
import { PromoModule } from './modules/promo/promo.module';
import { ConfigBotModule } from './modules/config-bot/config-bot.module';
import { SeedModule } from './database/seeds/seed.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    AuthModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '5432'), 10),
        username: config.get('DB_USER', 'admin'),
        password: config.get('DB_PASSWORD', 'admin'),
        database: config.get('DB_NAME', 'onboarding-db'),

        // Migrations au lieu de synchronize
        synchronize: false,
        // migrationsRun: true,
        // migrations: ['dist/database/migrations/*.js'],

        autoLoadEntities: true,
      }),
    }),

    SeedModule,
    UtilisateurModule,
    RoleModule,
    IdentificationModule,
    FormationModule,
    CampusModule,
    StatutPromoModule,
    StatutIdentificationModule,
    PromoModule,
    ConfigBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
