import { StatutIdentification } from '../statutIdentification.entity';
import { CreateStatutIdentificationDto } from '../dto/createStatutIdentification.dto';
import { UpdateStatutIdentificationDto } from '../dto/updateStatutIdentification.dto';

export interface IStatutIdentificationService {
  findByIds(ids: number[]): Promise<StatutIdentification[]>;
  findAll(): Promise<StatutIdentification[]>;
  findOne(id: number): Promise<StatutIdentification>;
  create(dto: CreateStatutIdentificationDto): Promise<StatutIdentification>;
  update(id: number, dto: UpdateStatutIdentificationDto): Promise<StatutIdentification>;
  remove(id: number): Promise<void>;
}