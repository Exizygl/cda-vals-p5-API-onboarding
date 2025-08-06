import { ConfigBotDto } from "./dto/config-bot.dto";
import { ConfigBot } from "./config-bot.entity";

export class ConfigBotMapper {
  static toEntity(dto: ConfigBotDto): ConfigBot {
    const role = new ConfigBot();

    return role;
  }

  static toPublic(entity: ConfigBot) {
    return {
     
    };
  }
}