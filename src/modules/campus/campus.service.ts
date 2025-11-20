import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Campus } from './campus.entity';
import { ICampusService } from './interface/ICampusService';
import { CreateCampusDto } from './dto/createCampus.dto';
import { UpdateCampusDto } from './dto/updateCampus.dto';
import { CampusMapper } from './campus.mapper';

@Injectable()
export class CampusService implements ICampusService {
  constructor(
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async findByIds(ids: string[]): Promise<Campus[]> {
    return this.campusRepository.find({ where: { id: In(ids) } });
  }

  async findAll(): Promise<Campus[]> {
    return this.campusRepository.find();
  }

  async findActif(): Promise<Campus[]> {
    return this.campusRepository.find({ where: { actif: true } });
  }
  
  async findOne(id: string): Promise<Campus> {
    const campus = await this.campusRepository.findOne({ where: { id } });
    if (!campus) {
      throw new NotFoundException(`Campus avec l'id ${id} introuvable`);
    }
    return campus;
  }

  async create(dto: CreateCampusDto): Promise<Campus> {
    const campus = CampusMapper.fromCreateDto(dto);
    return this.campusRepository.save(campus);
  }

  async update(id: string, dto: UpdateCampusDto): Promise<Campus> {
    const existingCampus = await this.campusRepository.findOne({ where: { id } });
    if (!existingCampus) {
      throw new NotFoundException(`Campus avec l'id ${id} introuvable`);
    }

    const updatedCampus = CampusMapper.fromUpdateDto(dto, existingCampus);
    return this.campusRepository.save(updatedCampus);
  }

  async remove(id: string): Promise<void> {
    const campus = await this.campusRepository.findOne({ where: { id } });
    if (!campus) {
      throw new NotFoundException(`Campus avec l'id ${id} introuvable`);
    }
    await this.campusRepository.remove(campus);
  }
}
