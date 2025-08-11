import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { CampusService } from './campus.service';
import { CreateCampusDto } from './dto/createCampus.dto';
import { UpdateCampusDto } from './dto/updateCampus.dto';
import { ICampusServiceToken } from './campus.constants';
import { ICampusService } from './interface/ICampusService';
@Controller('campuss')
export class CampusController {
  constructor(@Inject(ICampusServiceToken)
    private readonly campusService: ICampusService,) {}

  @Get()
  async findAll() {
    return this.campusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.campusService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateCampusDto) {
    return this.campusService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCampusDto) {
    return this.campusService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.campusService.remove(id);
    return { message: 'Campus deleted successfully' };
  }

    @Get('actif')
  async findActif() {
    return this.campusService.findActif(); 
  }
}