import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { StatutPromo } from '../../modules/statut-promo/statutPromo.entity';
import { StatutIdentification } from '../../modules/statut-identification/statutIdentification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatutPromo,
      StatutIdentification,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}