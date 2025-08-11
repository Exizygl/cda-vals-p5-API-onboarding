import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from './promo.entity';
import { PromoService } from './promo.service';
import { IPromoServiceToken } from './promo.constants';
import { PromoController } from './promo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Promo])],
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