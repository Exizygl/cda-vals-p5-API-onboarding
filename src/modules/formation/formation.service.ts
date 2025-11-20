import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Formation } from './formation.entity';
import { IFormationService } from './interface/IFormationService';
import { CreateFormationDto } from './dto/createFormation.dto';
import { UpdateFormationDto } from './dto/updateFormation.dto';
import { FormationMapper } from './formation.mapper';

@Injectable()
export class FormationService implements IFormationService {
  constructor(
    @InjectRepository(Formation)
    private readonly formationRepository: Repository<Formation>,
  ) {}

  async findByIds(ids: string[]): Promise<Formation[]> {
    return this.formationRepository.find({ where: { id: In(ids) } });
  }

  async findAll(): Promise<Formation[]> {
    return this.formationRepository.find();
  }

  async findActif(): Promise<Formation[]> {
    return this.formationRepository.find({ where: { actif: true } });
  }
  
  async findOne(id: string): Promise<Formation> {
    const formation = await this.formationRepository.findOne({ where: { id } });
    if (!formation) {
      throw new NotFoundException(`Formation avec l'id ${id} introuvable`);
    }
    return formation;
  }

  async create(dto: CreateFormationDto): Promise<Formation> {
    const formation = FormationMapper.fromCreateDto(dto);
    return this.formationRepository.save(formation);
  }

  async update(id: string, dto: UpdateFormationDto): Promise<Formation> {
    const existingFormation = await this.formationRepository.findOne({ where: { id } });
    if (!existingFormation) {
      throw new NotFoundException(`Formation avec l'id ${id} introuvable`);
    }

    const updatedFormation = FormationMapper.fromUpdateDto(dto, existingFormation);
    return this.formationRepository.save(updatedFormation);
  }

  async remove(id: string): Promise<void> {
    const formation = await this.formationRepository.findOne({ where: { id } });
    if (!formation) {
      throw new NotFoundException(`Formation avec l'id ${id} introuvable`);
    }
    await this.formationRepository.remove(formation);
  }
}
