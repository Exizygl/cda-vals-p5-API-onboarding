import { CreateIdentificationDto } from '../dto/createIdentification.dto';
import { UpdateIdentificationDto } from '../dto/updateIdentification.dto';
import { Identification } from '../identification.entity';

export interface IIdentificationService {
  create(dto: CreateIdentificationDto): Promise<Identification>;
  update(id: string, dto: UpdateIdentificationDto): Promise<Identification>;
  findById(id: string): Promise<Identification>;

}