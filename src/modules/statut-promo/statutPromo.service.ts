import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { StatutPromo } from './statutPromo.entity';
import { IStatutPromoService } from './interface/IStatutPromoService';
import { CreateStatutPromoDto } from './dto/createStatutPromo.dto';
import { UpdateStatutPromoDto } from './dto/updateStatutPromo.dto';
import { StatutPromoMapper } from './statutPromo.mapper';
import { IStatutPromoServiceToken } from './statutPromo.constants';

@Injectable()
export class StatutPromoService implements IStatutPromoService {
  constructor(
    @InjectRepository(StatutPromo)
    private readonly statutPromoRepository: Repository<StatutPromo>,
  ) {}

  async findByIds(ids: number[]): Promise<StatutPromo[]> {
    return this.statutPromoRepository.find({ where: { id: In(ids) } });
  }

  async findAll(): Promise<StatutPromo[]> {
    return this.statutPromoRepository.find();
  }
 
  async findOne(id: number): Promise<StatutPromo> {
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

  async update(id: number, dto: UpdateStatutPromoDto): Promise<StatutPromo> {
    const existingStatutPromo = await this.statutPromoRepository.findOne({ where: { id } });
    if (!existingStatutPromo) {
      throw new NotFoundException(`StatutPromo avec l'id ${id} introuvable`);
    }

    const updatedStatutPromo = StatutPromoMapper.fromUpdateDto(dto, existingStatutPromo);
    return this.statutPromoRepository.save(updatedStatutPromo);
  }

  async remove(id: number): Promise<void> {
    const statutPromo = await this.statutPromoRepository.findOne({ where: { id } });
    if (!statutPromo) {
      throw new NotFoundException(`StatutPromo avec l'id ${id} introuvable`);
    }
    await this.statutPromoRepository.remove(statutPromo);
  }

   async findByLibelle(libelle: string): Promise<StatutPromo> {
    const statut = await this.statutPromoRepository.findOne({
      where: { libelle },
    });

       if (!statut) {
      throw new NotFoundException(`Statut "${libelle}" not found`);
    }

    return statut;
  }
}
