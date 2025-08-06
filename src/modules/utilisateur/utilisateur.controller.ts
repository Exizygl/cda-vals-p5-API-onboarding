import { Body, Controller, Post, Get, Patch, Param} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/createUtilisateur.dto';
import { UpdateUtilisateurDto } from './dto/updateUtilisateur.dto';

@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Post()
  async create(@Body() dto: CreateUtilisateurDto) {
    return this.utilisateurService.create(dto);
  }

   @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUtilisateurDto) {
    return this.utilisateurService.update(id, dto);
  }
}
