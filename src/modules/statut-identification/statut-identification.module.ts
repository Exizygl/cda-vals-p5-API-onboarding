import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutIdentificationService } from './statut-identification.service';
import { StatutIdentificationController } from './statut-identification.controller';
import { StatutIdentification } from './statut-identification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatutIdentification])],
  providers: [StatutIdentificationService],
  controllers: [StatutIdentificationController]
})
export class StatutIdentificationModule {}
