import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UtilisateurModule } from './modules/utilisateur/utilisateur.module';
import { RoleModule } from './modules/role/role.module';
import { IdentificationModule } from './modules/identification/identification.module';
import { FormationModule } from './modules/formation/formation.module';
import { CampusModule } from './modules/campus/campus.module';
import { StatutPromoModule } from './modules/statut-promo/statut-promo.module';
import { StatutIdentificationModule } from './modules/statut-identification/statut-identification.module';
import { PromoModule } from './modules/promo/promo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT', '5432'), 10),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        synchronize: true,
        autoLoadEntities: true,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}