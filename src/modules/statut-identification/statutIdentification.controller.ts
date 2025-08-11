import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { StatutIdentificationService } from './statutIdentification.service';
import { CreateStatutIdentificationDto } from './dto/createStatutIdentification.dto';
import { UpdateStatutIdentificationDto } from './dto/updateStatutIdentification.dto';
import { IStatutIdentificationServiceToken } from './statutIdentification.constants';
import { IStatutIdentificationService } from './interface/IStatutIdentificationService';
@Controller('statut-promos')
export class StatutIdentificationController {
  constructor(@Inject(IStatutIdentificationServiceToken)
    private readonly formationService: IStatutIdentificationService,) {}

  @Get()
  async findAll() {
    return this.formationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.formationService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateStatutIdentificationDto) {
    return this.formationService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStatutIdentificationDto) {
    return this.formationService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.formationService.remove(id);
    return { message: 'statutIdentification deleted successfully' };
  }

}