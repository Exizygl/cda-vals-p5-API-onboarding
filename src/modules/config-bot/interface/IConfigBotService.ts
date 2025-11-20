import { ConfigBot } from '../config-bot.entity';

export interface IConfigBotService {
  findAll(): Promise<ConfigBot[]>;
  findOne(configId: number): Promise<ConfigBot | null>;
  create(configBot: ConfigBot): Promise<ConfigBot>;
  update(configId: number, configBot: Partial<ConfigBot>): Promise<ConfigBot | null>;
  delete(configId: number): Promise<void>;
}