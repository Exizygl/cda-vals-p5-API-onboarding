import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { StatutIdentification } from './statutIdentification.entity';
import { IStatutIdentificationService } from './interface/IStatutIdentificationService';
import { CreateStatutIdentificationDto } from './dto/createStatutIdentification.dto';
import { UpdateStatutIdentificationDto } from './dto/updateStatutIdentification.dto';
import { StatutIdentificationMapper } from './statutIdentification.mapper';

@Injectable()
export class StatutIdentificationService implements IStatutIdentificationService {
  constructor(
    @InjectRepository(StatutIdentification)
    private readonly statutIdentificationRepository: Repository<StatutIdentification>,
  ) {}

  async findByIds(ids: number[]): Promise<StatutIdentification[]> {
    return this.statutIdentificationRepository.find({ where: { id: In(ids) } });
  }

  async findAll(): Promise<StatutIdentification[]> {
    return this.statutIdentificationRepository.find();
  }
 
  async findOne(id: number): Promise<StatutIdentification> {
    const statutIdentification = await this.statutIdentificationRepository.findOne({ where: { id } });
    if (!statutIdentification) {
      throw new NotFoundException(`StatutIdentification avec l'id ${id} introuvable`);
    }
    return statutIdentification;
  }

  async create(dto: CreateStatutIdentificationDto): Promise<StatutIdentification> {
    const statutIdentification = StatutIdentificationMapper.fromCreateDto(dto);
    return this.statutIdentificationRepository.save(statutIdentification);
  }

  async update(id: number, dto: UpdateStatutIdentificationDto): Promise<StatutIdentification> {
    const existingStatutIdentification = await this.statutIdentificationRepository.findOne({ where: { id } });
    if (!existingStatutIdentification) {
      throw new NotFoundException(`StatutIdentification avec l'id ${id} introuvable`);
    }

    const updatedStatutIdentification = StatutIdentificationMapper.fromUpdateDto(dto, existingStatutIdentification);
    return this.statutIdentificationRepository.save(updatedStatutIdentification);
  }

  async remove(id: number): Promise<void> {
    const statutIdentification = await this.statutIdentificationRepository.findOne({ where: { id } });
    if (!statutIdentification) {
      throw new NotFoundException(`StatutIdentification avec l'id ${id} introuvable`);
    }
    await this.statutIdentificationRepository.remove(statutIdentification);
  }
}