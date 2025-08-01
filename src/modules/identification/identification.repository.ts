import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Identification } from './identification.entity';

@Injectable()
export class IdentificationService {
  constructor(
    @InjectRepository(Identification)
    private readonly identificationRepo: Repository<Identification>,
  ) {}

  async findAll(): Promise<Identification[]> {
    return this.identificationRepo.find();
  }

  async findOne(id: string): Promise<Identification | null> {
    return this.identificationRepo.findOne({ where: { id } });
  }

  async create(user: Identification): Promise<Identification> {
    return this.identificationRepo.save(user);
  }
}