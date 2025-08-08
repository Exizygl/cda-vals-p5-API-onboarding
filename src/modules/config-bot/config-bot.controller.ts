import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ConfigBotService } from './config-bot.service';
import { ConfigBotDto } from './dto/config-bot.dto';
import { ConfigBotMapper } from './config-bot.mapper';

@Controller('config-bot')
export class ConfigBotController {
  constructor(private readonly configBotService: ConfigBotService) {}

  @Get()
  async findAll() {
    const configs = await this.configBotService.findAll();
    return configs.map(ConfigBotMapper.toPublic);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const config = await this.configBotService.findOne(id);
    return config ? ConfigBotMapper.toPublic(config) : null;
  }

  @Post()
  async create(@Body() dto: ConfigBotDto) {
    const entity = ConfigBotMapper.toEntity(dto);
    const created = await this.configBotService.create(entity);
    return ConfigBotMapper.toPublic(created);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: Partial<ConfigBotDto>) {
    const updated = await this.configBotService.update(id, dto);
    return updated ? ConfigBotMapper.toPublic(updated) : null;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.configBotService.delete(id);
    return { deleted: true };
  }
}
