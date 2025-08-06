import { ConfigBotService } from '../config-bot.service';
import { ConfigBot } from '../config-bot.entity';

export interface IConfigBotService {
  findAll(): Promise<ConfigBot[]>;
  findOne(configId: number): Promise<ConfigBot | null>;
  create(configBot: ConfigBot): Promise<ConfigBot>;
}