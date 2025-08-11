import { Module } from '@nestjs/common';
import { StatutIdentificationController } from './statutIdentification.controller';
import { StatutIdentificationService } from './statutIdentification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatutIdentification } from './statutIdentification.entity';
import { IStatutIdentificationServiceToken } from './statutIdentification.constants';

@Module({
  imports: [TypeOrmModule.forFeature([StatutIdentification])],
  providers: [
    {
      provide: IStatutIdentificationServiceToken,
      useClass: StatutIdentificationService,
    },
  ],
  exports: [IStatutIdentificationServiceToken],
  controllers: [StatutIdentificationController]
})
export class StatutIdentificationModule {}