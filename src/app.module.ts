import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'admin',
      password: 'admin',
      database: 'onboarding-db',
      synchronize: true,
      autoLoadEntities: true,
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