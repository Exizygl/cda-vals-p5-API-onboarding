import { Formation } from '../formation.entity';
import { CreateFormationDto } from '../dto/createFormation.dto';
import { UpdateFormationDto } from '../dto/updateFormation.dto';

export interface IFormationService {
  findByIds(ids: string[]): Promise<Formation[]>;
  findAll(): Promise<Formation[]>;
  findActif(): Promise<Formation[]>;
  findOne(id: string): Promise<Formation>;
  create(dto: CreateFormationDto): Promise<Formation>;
  update(id: string, dto: UpdateFormationDto): Promise<Formation>;
  remove(id: string): Promise<void>;
}
