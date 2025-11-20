import { Module } from '@nestjs/common';
import { CampusController } from './campus.controller';
import { CampusService } from './campus.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campus } from './campus.entity';
import { ICampusServiceToken } from './campus.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Campus])],
  providers: [
    {
      provide: ICampusServiceToken,
      useClass: CampusService,
    },
  ],
  exports: [ICampusServiceToken],
  controllers: [CampusController]
})
export class CampusModule {}
