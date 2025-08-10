import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { StatutPromo } from './statutPromo.entity';
import { IStatutPromoService } from './interface/IStatutPromoService';
import { CreateStatutPromoDto } from './dto/createStatutPromo.dto';
import { UpdateStatutPromoDto } from './dto/updateStatutPromo.dto';
import { StatutPromoMapper } from './statutPromo.mapper';

@Injectable()
export class StatutPromoService implements IStatutPromoService {
  constructor(
    @InjectRepository(StatutPromo)
    private readonly statutPromoRepository: Repository<StatutPromo>,
  ) {}

  async findByIds(ids: string[]): Promise<StatutPromo[]> {
    return this.statutPromoRepository.find({ where: { id: In(ids) } });
  }

  async findAll(): Promise<StatutPromo[]> {
    return this.statutPromoRepository.find();
  }
 
  async findOne(id: string): Promise<StatutPromo> {
    const statutPromo = await this.statutPromoRepository.findOne({ where: { id } });
    if (!statutPromo) {
      throw new NotFoundException(`StatutPromo avec l'id ${id} introuvable`);
    }
    return statutPromo;
  }

  async create(dto: CreateStatutPromoDto): Promise<StatutPromo> {
    const statutPromo = StatutPromoMapper.fromCreateDto(dto);
    return this.statutPromoRepository.save(statutPromo);
  }

  async update(id: string, dto: UpdateStatutPromoDto): Promise<StatutPromo> {
    const existingStatutPromo = await this.statutPromoRepository.findOne({ where: { id } });
    if (!existingStatutPromo) {
      throw new NotFoundException(`StatutPromo avec l'id ${id} introuvable`);
    }

    const updatedStatutPromo = StatutPromoMapper.fromUpdateDto(dto, existingStatutPromo);
    return this.statutPromoRepository.save(updatedStatutPromo);
  }

  async remove(id: string): Promise<void> {
    const statutPromo = await this.statutPromoRepository.findOne({ where: { id } });
    if (!statutPromo) {
      throw new NotFoundException(`StatutPromo avec l'id ${id} introuvable`);
    }
    await this.statutPromoRepository.remove(statutPromo);
  }
}
