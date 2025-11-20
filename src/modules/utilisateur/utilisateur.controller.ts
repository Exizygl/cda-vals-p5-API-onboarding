import { Body, Controller, Post, Get, Patch, Param, Delete, Inject} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/createUtilisateur.dto';
import { UpdateUtilisateurDto } from './dto/updateUtilisateur.dto';
import { UpdateRolesUtilisateurDto } from './dto/updateRolesUtilisateur.dto';
import { IUtilisateurServiceToken } from './Utilisateur.constant';
import { IUtilisateurService } from './interfaces/IUtilisateurService'

@Controller('utilisateurs')
export class UtilisateurController {
  constructor(
    @Inject(IUtilisateurServiceToken)
    private readonly utilisateurService: IUtilisateurService,
  ) {}
  @Post()
  async create(@Body() dto: CreateUtilisateurDto) {
    return this.utilisateurService.create(dto);
  }

   @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUtilisateurDto) {
    return this.utilisateurService.update(id, dto);
  }

   @Post(':id/roles')
  async addRoles(@Param('id') id: string, @Body() dto: UpdateRolesUtilisateurDto) {
    return this.utilisateurService.addRoles(id, dto);
  }

  @Delete(':id/roles')
  async removeRoles(@Param('id') id: string, @Body() dto: UpdateRolesUtilisateurDto) {
    return this.utilisateurService.removeRoles(id, dto);
  }
}
