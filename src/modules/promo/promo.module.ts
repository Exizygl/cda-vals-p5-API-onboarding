import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from './promo.entity';
import { PromoService } from './promo.service';
import { IPromoServiceToken } from './promo.constants';
import { PromoController } from './promo.controller';
import { StatutPromo } from '../statut-promo/statutPromo.entity';
import { StatutPromoModule } from '../statut-promo/statutPromo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Promo]), StatutPromoModule],
  providers: [
    {
      provide: IPromoServiceToken,
      useClass: PromoService,
    },
  ],
  controllers: [PromoController],
  exports: [IPromoServiceToken],
})
export class PromoModule {}