import { Injectable, NotFoundException } from '@nestjs/common';
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
    const existingConfig = await this.configBotRepo.findOne({ where: { configId } });
    
    if (!existingConfig) {
      throw new NotFoundException(`ConfigBot with id ${configId} not found`);
    }

    const updated = this.configBotRepo.merge(existingConfig, updateData);
    return this.configBotRepo.save(updated);
  }

  async delete(configId: number): Promise<void> {
    await this.configBotRepo.delete(configId);
  }
}
