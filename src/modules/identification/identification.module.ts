import { Module } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';
import { Identification } from './identification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutIdentification } from '../statut-identification/statutIdentification.entity';
import { Promo } from '../promo/promo.entity';
import { Utilisateur } from '../utilisateur/utilisateur.entity';
import { IIdentificationServiceToken } from './identification.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Identification,
      StatutIdentification, 
      Promo,
      Utilisateur,])],
  providers: [{
      provide: IIdentificationServiceToken,
      useClass: IdentificationService,
    },],
    exports: [IIdentificationServiceToken],
  controllers: [IdentificationController]
})
export class IdentificationModule {}
