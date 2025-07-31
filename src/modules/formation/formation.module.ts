import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormationService } from './formation.service';
import { FormationController } from './formation.controller';
import { Formation } from './formation.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Formation])],
  providers: [FormationService],
  controllers: [FormationController]
})
export class FormationModule {}
