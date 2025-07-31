import { Module } from '@nestjs/common';
import { PromoService } from './promo.service';
import { PromoController } from './promo.controller';
import { Promo } from './promo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Promo])],
  providers: [PromoService],
  controllers: [PromoController]
})
export class PromoModule {}
