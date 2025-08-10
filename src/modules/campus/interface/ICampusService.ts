import { Campus } from '../campus.entity';
import { CreateCampusDto } from '../dto/createCampus.dto';
import { UpdateCampusDto } from '../dto/updateCampus.dto';

export interface ICampusService {
  findByIds(ids: string[]): Promise<Campus[]>;
  findAll(): Promise<Campus[]>;
  findActif(): Promise<Campus[]>;
  findOne(id: string): Promise<Campus>;
  create(dto: CreateCampusDto): Promise<Campus>;
  update(id: string, dto: UpdateCampusDto): Promise<Campus>;
  remove(id: string): Promise<void>;
}
