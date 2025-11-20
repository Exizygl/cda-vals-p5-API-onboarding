import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigBotService } from './config-bot.service';
import { ConfigBotController } from './config-bot.controller';
import { ConfigBot } from './config-bot.entity';
import { IConfigBotServiceToken } from './config-bot.constants';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigBot])],
  providers: [
    ConfigBotService,
    {
      provide: IConfigBotServiceToken,
      useClass: ConfigBotService,
    },
  ],
  controllers: [ConfigBotController]
})
export class ConfigBotModule {}
