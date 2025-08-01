import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campus } from './campus.entity';

@Injectable()
export class CampusService {
  constructor(
    @InjectRepository(Campus)
    private readonly campusRepo: Repository<Campus>,
  ) {}

  async findAll(): Promise<Campus[]> {
    return this.campusRepo.find();
  }

  async findOne(id: string): Promise<Campus | null> {
    return this.campusRepo.findOne({ where: { id } });
  }

  async create(user: Campus): Promise<Campus> {
    return this.campusRepo.save(user);
  }
}