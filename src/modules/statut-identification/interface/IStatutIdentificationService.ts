import { StatutIdentification } from '../statutIdentification.entity';
import { CreateStatutIdentificationDto } from '../dto/createStatutIdentification.dto';
import { UpdateStatutIdentificationDto } from '../dto/updateStatutIdentification.dto';

export interface IStatutIdentificationService {
  findByIds(ids: string[]): Promise<StatutIdentification[]>;
  findAll(): Promise<StatutIdentification[]>;
  findOne(id: string): Promise<StatutIdentification>;
  create(dto: CreateStatutIdentificationDto): Promise<StatutIdentification>;
  update(id: string, dto: UpdateStatutIdentificationDto): Promise<StatutIdentification>;
  remove(id: string): Promise<void>;
}