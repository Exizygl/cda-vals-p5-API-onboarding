import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { StatutPromoService } from './statutPromo.service';
import { CreateStatutPromoDto } from './dto/createStatutPromo.dto';
import { UpdateStatutPromoDto } from './dto/updateStatutPromo.dto';
import { IStatutPromoServiceToken } from './statutPromo.constants';
import { IStatutPromoService } from './interface/IStatutPromoService';
@Controller('statut-promos')
export class StatutPromoController {
  constructor(@Inject(IStatutPromoServiceToken)
    private readonly formationService: IStatutPromoService,) {}

  @Get()
  async findAll() {
    return this.formationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.formationService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateStatutPromoDto) {
    return this.formationService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStatutPromoDto) {
    return this.formationService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.formationService.remove(id);
    return { message: 'statutPromo deleted successfully' };
  }

}