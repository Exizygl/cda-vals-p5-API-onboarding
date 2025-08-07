import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigBot } from './config-bot.entity';
import { IConfigBotService } from './interface/IConfigBotService';

@Injectable()
export class ConfigBotService implements IConfigBotService {
  constructor(
    @InjectRepository(ConfigBot)
    private readonly configBotRepo: Repository<ConfigBot>,
  ) {}

  async findAll(): Promise<ConfigBot[]> {
    return this.configBotRepo.find();
  }

  async findOne(configId: number): Promise<ConfigBot | null> {
    return this.configBotRepo.findOne({ where: { configId } });
  }

  async create(configBot: ConfigBot): Promise<ConfigBot> {
    return this.configBotRepo.save(configBot);
  }

  async update(configId: number, updateData: Partial<ConfigBot>): Promise<ConfigBot | null> {
    await this.configBotRepo.update(configId, updateData);
    return this.findOne(configId);
  }

  async delete(configId: number): Promise<void> {
    await this.configBotRepo.delete(configId);
  }
}
