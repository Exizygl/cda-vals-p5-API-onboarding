import { CreatePromoDto } from '../dto/createPromo.dto';
import { UpdatePromoDto } from '../dto/updatePromo.dto';
import { Promo } from '../promo.entity';

export interface IPromoService {
    findByIds(ids: string[]): Promise<Promo[]>;
    findBySnowflakes(snowflakes: string[]): Promise<Promo[]>;
    findAll(): Promise<Promo[]>;
    findActif(): Promise<Promo[]>;
    findOne(id: string): Promise<Promo>;
    findOneBySnowflake(snowflake: string): Promise<Promo>;
    findPromoToStart(): Promise<Promo | null>;
    findPromoToArchive(): Promise<Promo | null>;
    create(dto: CreatePromoDto): Promise<Promo>;
    update(id: string, dto: UpdatePromoDto): Promise<Promo>;
}