import { StatutPromo } from '../statutPromo.entity';
import { CreateStatutPromoDto } from '../dto/createStatutPromo.dto';
import { UpdateStatutPromoDto } from '../dto/updateStatutPromo.dto';

export interface IStatutPromoService {
  findByIds(ids: string[]): Promise<StatutPromo[]>;
  findAll(): Promise<StatutPromo[]>;
  findOne(id: string): Promise<StatutPromo>;
  create(dto: CreateStatutPromoDto): Promise<StatutPromo>;
  update(id: string, dto: UpdateStatutPromoDto): Promise<StatutPromo>;
  remove(id: string): Promise<void>;
}
