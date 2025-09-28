import { StatutPromo } from '../statutPromo.entity';
import { CreateStatutPromoDto } from '../dto/createStatutPromo.dto';
import { UpdateStatutPromoDto } from '../dto/updateStatutPromo.dto';

export interface IStatutPromoService {
  findByIds(ids: number[]): Promise<StatutPromo[]>;
  findAll(): Promise<StatutPromo[]>;
  findOne(id: number): Promise<StatutPromo>;
  create(dto: CreateStatutPromoDto): Promise<StatutPromo>;
  update(id: number, dto: UpdateStatutPromoDto): Promise<StatutPromo>;
  remove(id: number): Promise<void>;
  findByLibelle(libelle: string): Promise<StatutPromo | null>;

}
