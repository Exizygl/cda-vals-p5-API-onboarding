import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { IPromoService } from './interface/IPromoService';
import { IPromoServiceToken } from './promo.constants';
import { CreatePromoDto } from './dto/createPromo.dto';
import { UpdatePromoDto } from './dto/updatePromo.dto';
import { Promo } from './promo.entity';

@Controller('promos')
export class PromoController {
  constructor(
    @Inject(IPromoServiceToken)
    private readonly promoService: IPromoService,
  ) {}

  @Get()
  async findAll(): Promise<Promo[]> {
    return this.promoService.findAll();
  }

  @Get('actif')
  async findActif(): Promise<Promo[]> {
    return this.promoService.findActif();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Promo> {
    return this.promoService.findOne(id);
  }

  @Get('snowflake/:snowflake')
  async findOneBySnowflake(@Param('snowflake') snowflake: string): Promise<Promo> {
    return this.promoService.findOneBySnowflake(snowflake);
  }

  @Post()
  async create(@Body() dto: CreatePromoDto): Promise<Promo> {
    return this.promoService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePromoDto): Promise<Promo> {
    return this.promoService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.promoService.remove(id);
  }
}
