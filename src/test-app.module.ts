import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Feature modules
import { UtilisateurModule } from './modules/utilisateur/utilisateur.module';
import { RoleModule } from './modules/role/role.module';
import { IdentificationModule } from './modules/identification/identification.module';
import { FormationModule } from './modules/formation/formation.module';
import { CampusModule } from './modules/campus/campus.module';
import { StatutIdentificationModule } from './modules/statut-identification/statutIdentification.module';
import { StatutPromoModule } from './modules/statut-promo/statutPromo.module';
import { PromoModule } from './modules/promo/promo.module';
import { ConfigBotModule } from './modules/config-bot/config-bot.module';
import { Promo } from './modules/promo/promo.entity';
import { StatutPromo } from './modules/statut-promo/statutPromo.entity';
import { Formation } from './modules/formation/formation.entity';
import { Campus } from './modules/campus/campus.entity';
import { Identification } from './modules/identification/identification.entity';
import { Utilisateur } from './modules/utilisateur/utilisateur.entity';
import { StatutIdentification } from './modules/statut-identification/statutIdentification.entity';
import { Role } from './modules/role/role.entity';
import { ConfigBot } from './modules/config-bot/config-bot.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.test',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '5432'), 10),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'onboarding_test'),
        synchronize: true,
        entities: [
        Promo,
        StatutPromo,
        Formation,
        Campus,
        Identification,
        Utilisateur,
        StatutIdentification,
        Role,
        ConfigBot,
        ],
      }),
    }),

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
})
export class TestAppModule {}
