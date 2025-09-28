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
          __dirname + '/modules/**/*.entity{.ts,.js}', // or list them manually
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
