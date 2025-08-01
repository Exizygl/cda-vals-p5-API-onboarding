import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatutIdentification } from './statut-identification.entity';

@Injectable()
export class StatutIdentificationService {
  constructor(
    @InjectRepository(StatutIdentification)
    private readonly roleRepo: Repository<StatutIdentification>,
  ) {}

  async findAll(): Promise<StatutIdentification[]> {
    return this.roleRepo.find();
  }

  async findOne(id: string): Promise<StatutIdentification | null> {
    return this.roleRepo.findOne({ where: { id } });
  }

  async create(user: StatutIdentification): Promise<StatutIdentification> {
    return this.roleRepo.save(user);
  }
}