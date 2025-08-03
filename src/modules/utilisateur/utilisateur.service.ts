import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from './utilisateur.entity';
import { UtilisateurDto } from './dto/utilisateur.dto';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async create(dto: UtilisateurDto): Promise<Utilisateur> {
    const utilisateur = this.utilisateurRepository.create(dto);
    return this.utilisateurRepository.save(utilisateur);
  }

}
