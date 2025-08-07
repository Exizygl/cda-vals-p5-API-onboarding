import { EntityRepository, Repository } from 'typeorm';
import { ConfigBot } from './config-bot.entity';

@EntityRepository(ConfigBot)
export class ConfigBotRepository extends Repository<ConfigBot> {}
