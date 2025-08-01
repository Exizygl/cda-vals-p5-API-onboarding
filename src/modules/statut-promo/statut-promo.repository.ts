import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatutPromo } from './statut-promo.entity';

@Injectable()
export class StatutPromoService {
  constructor(
    @InjectRepository(StatutPromo)
    private readonly roleRepo: Repository<StatutPromo>,
  ) {}

  async findAll(): Promise<StatutPromo[]> {
    return this.roleRepo.find();
  }

  async findOne(id: string): Promise<StatutPromo | null> {
    return this.roleRepo.findOne({ where: { id } });
  }

  async create(user: StatutPromo): Promise<StatutPromo> {
    return this.roleRepo.save(user);
  }
}