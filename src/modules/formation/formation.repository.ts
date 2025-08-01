import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formation } from './formation.entity';

@Injectable()
export class FormationService {
  constructor(
    @InjectRepository(Formation)
    private readonly formationRepo: Repository<Formation>,
  ) {}

  async findAll(): Promise<Formation[]> {
    return this.formationRepo.find();
  }

  async findOne(id: string): Promise<Formation | null> {
    return this.formationRepo.findOne({ where: { id } });
  }

  async create(user: Formation): Promise<Formation> {
    return this.formationRepo.save(user);
  }
}