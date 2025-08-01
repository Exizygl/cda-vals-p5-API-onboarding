import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promo } from './promo.entity';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepo: Repository<Promo>,
  ) {}

  async findAll(): Promise<Promo[]> {
    return this.promoRepo.find();
  }

  async findOne(id: string): Promise<Promo | null> {
    return this.promoRepo.findOne({ where: { id } });
  }

  async create(user: Promo): Promise<Promo> {
    return this.promoRepo.save(user);
  }
}