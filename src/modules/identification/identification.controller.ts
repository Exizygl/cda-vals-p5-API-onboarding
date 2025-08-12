import { Body, Controller, Param, Post, Put, Get} from '@nestjs/common';
import { CreateIdentificationDto } from './dto/createIdentification.dto';
import { UpdateIdentificationDto } from './dto/updateIdentification.dto';
import { Identification } from './identification.entity';
import { IIdentificationService } from './interface/IIdentificationService';
import { IdentificationMapper } from './identification.mapper';
import { Inject } from '@nestjs/common';

@Controller('identifications')
export class IdentificationController {
  constructor(
    @Inject('IIdentificationService')
    private readonly identificationService: IIdentificationService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Identification> {
    return this.identificationService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateIdentificationDto): Promise<Identification> {
    return this.identificationService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIdentificationDto,
  ): Promise<Identification> {
    return this.identificationService.update(id, dto);
  }
}
