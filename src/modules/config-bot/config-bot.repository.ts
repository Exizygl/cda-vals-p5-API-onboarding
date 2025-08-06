import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigBot } from './config-bot.entity';

@Injectable()
export class ConfigBotService {
  constructor(
    @InjectRepository(ConfigBot)
    private readonly roleRepo: Repository<ConfigBot>,
  ) {}

  async findAll(): Promise<ConfigBot[]> {
    return this.roleRepo.find();
  }

  async findOne(configId: number): Promise<ConfigBot | null> {
    return this.roleRepo.findOne({ where: { configId } });
  }

  async create(user: ConfigBot): Promise<ConfigBot> {
    return this.roleRepo.save(user);
  }
}
