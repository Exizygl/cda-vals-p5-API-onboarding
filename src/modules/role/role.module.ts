import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { IRoleServiceToken } from './role.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [
    {
      provide: IRoleServiceToken,
      useClass: RoleService,
    },
  ],
  exports: [IRoleServiceToken],
  controllers: [RoleController]
})
export class RoleModule {}
