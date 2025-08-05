import { Body, Controller, Post, Get } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/createUtilisateur.dto';

@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Post()
  async create(@Body() dto: CreateUtilisateurDto) {
    return this.utilisateurService.create(dto);
  }


}
