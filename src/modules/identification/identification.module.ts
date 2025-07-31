import { Module } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';
import { Identification } from './identification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Identification])],
  providers: [IdentificationService],
  controllers: [IdentificationController]
})
export class IdentificationModule {}
