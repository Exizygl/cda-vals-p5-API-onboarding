import { Module } from '@nestjs/common';
import { StatutPromoController } from './statutPromo.controller';
import { StatutPromoService } from './statutPromo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutPromo } from './statutPromo.entity';
import { IStatutPromoServiceToken } from './statutPromo.constants';

@Module({
  imports: [TypeOrmModule.forFeature([StatutPromo])],
  providers: [
    {
      provide: IStatutPromoServiceToken,
      useClass: StatutPromoService,
    },
  ],
  exports: [IStatutPromoServiceToken],
  controllers: [StatutPromoController]
})
export class StatutPromoModule {}
