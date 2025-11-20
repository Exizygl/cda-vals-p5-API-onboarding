import { Module } from '@nestjs/common';
import { FormationController } from './formation.controller';
import { FormationService } from './formation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formation } from './formation.entity';
import { IFormationServiceToken } from './formation.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Formation])],
  providers: [
    {
      provide: IFormationServiceToken,
      useClass: FormationService,
    },
  ],
  exports: [IFormationServiceToken],
  controllers: [FormationController]
})
export class FormationModule {}
