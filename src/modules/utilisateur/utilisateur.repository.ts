import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from './utilisateur.entity';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepo: Repository<Utilisateur>,
  ) {}

  async findAll(): Promise<Utilisateur[]> {
    return this.utilisateurRepo.find();
  }

  async findOne(id: string): Promise<Utilisateur | null> {
    return this.utilisateurRepo.findOne({ where: { id } });
  }

  async create(user: Utilisateur): Promise<Utilisateur> {
    return this.utilisateurRepo.save(user);
  }
}