import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigBotService } from './config-bot.service';
import { ConfigBotController } from './config-bot.controller';
import { ConfigBot } from './config-bot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigBot])],
  providers: [ConfigBotService],
  controllers: [ConfigBotController]
})
export class StatutIdentificationModule {}
