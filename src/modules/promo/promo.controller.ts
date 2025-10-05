import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseArrayPipe,
  Inject,
} from '@nestjs/common';
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


  @Get('to-start')
  async findPromoToStart(): Promise<Promo[] | null> {
    return this.promoService.findPromoToStart();
  }


  @Get('to-archive')
  async findPromoToArchive(): Promise<Promo[]> {
    const promos = await this.promoService.findPromoToArchive();
    return promos ?? [];
}

  @Get('by-ids')
  async findByIds(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ): Promise<Promo[]> {
    return this.promoService.findByIds(ids);
  }


  @Get('by-snowflakes')
  async findBySnowflakes(
    @Query('snowflakes', new ParseArrayPipe({ items: String, separator: ',' }))
    snowflakes: string[],
  ): Promise<Promo[]> {
    return this.promoService.findBySnowflakes(snowflakes);
  }


  @Get('snowflake/:snowflake')
  async findOneBySnowflake(@Param('snowflake') snowflake: string): Promise<Promo> {
    return this.promoService.findOneBySnowflake(snowflake);
  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Promo> {
    return this.promoService.findOne(id);
  }


  @Post()
  async create(@Body() dto: CreatePromoDto): Promise<Promo> {
    return this.promoService.create(dto);
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePromoDto,
  ): Promise<Promo> {
    return this.promoService.update(id, dto);
  }
}