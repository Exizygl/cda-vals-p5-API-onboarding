import { PromoDto } from './dto/promo.dto';
import { Promo } from './promo.entity';



export class PromoMapper {
  static toEntity(dto: PromoDto): Promo {
    const promo = new Promo();

    return promo;
  }

  static toPublic(entity: Promo) {
    return {
     
    };
  }
}
