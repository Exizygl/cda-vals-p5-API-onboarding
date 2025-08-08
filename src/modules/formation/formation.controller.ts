import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { FormationService } from './formation.service';
import { CreateFormationDto } from './dto/createFormation.dto';
import { UpdateFormationDto } from './dto/updateFormation.dto';
import { IFormationServiceToken } from './formation.constants';
import { IFormationService } from './interface/IFormationService';
@Controller('formations')
export class FormationController {
  constructor(@Inject(IFormationServiceToken)
    private readonly formationService: IFormationService,) {}

  @Get()
  async findAll() {
    return this.formationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.formationService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateFormationDto) {
    return this.formationService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFormationDto) {
    return this.formationService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.formationService.remove(id);
    return { message: 'Formation deleted successfully' };
  }

    @Get('actif')
  async findActif() {
    return this.formationService.findActif(); 
  }
}