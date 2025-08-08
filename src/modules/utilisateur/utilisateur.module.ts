import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { Utilisateur } from './utilisateur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { IUtilisateurServiceToken } from './Utilisateur.constant';


@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur]), RoleModule],
  controllers: [UtilisateurController],
  providers: [
    {
      provide: IUtilisateurServiceToken,
      useClass: UtilisateurService,
    },
  ],
  exports: [IUtilisateurServiceToken],
})
export class UtilisateurModule {}