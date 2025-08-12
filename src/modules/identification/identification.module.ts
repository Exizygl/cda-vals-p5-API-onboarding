import { Module } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';
import { Identification } from './identification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutIdentification } from '../statut-identification/statutIdentification.entity';
import { Promo } from '../promo/promo.entity';
import { Utilisateur } from '../utilisateur/utilisateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Identification,
      StatutIdentification, // <- This is the one missing
      Promo,
      Utilisateur,])],
  providers: [IdentificationService],
  controllers: [IdentificationController]
})
export class IdentificationModule {}
