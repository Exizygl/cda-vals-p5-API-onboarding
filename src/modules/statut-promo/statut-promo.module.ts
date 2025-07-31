import { Module } from '@nestjs/common';
import { StatutPromoService } from './statut-promo.service';
import { StatutPromoController } from './statut-promo.controller';
import { StatutPromo } from './statut-promo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StatutPromo])],
  providers: [StatutPromoService],
  controllers: [StatutPromoController]
})
export class StatutPromoModule {}
