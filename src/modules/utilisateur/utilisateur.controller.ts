import { Body, Controller, Post, Get } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurDto } from './dto/utilisateur.dto';

@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Post()
  async create(@Body() dto: UtilisateurDto) {
    return this.utilisateurService.create(dto);
  }


}
