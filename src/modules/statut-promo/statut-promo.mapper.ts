import { StatutPromoDto } from "./dto/statut-promo.dto";
import { StatutPromo } from "./statut-promo.entity";

export class StatutPromoMapper {
  static toEntity(dto: StatutPromoDto): StatutPromo {
    const role = new StatutPromo();

    return role;
  }

  static toPublic(entity: StatutPromo) {
    return {
     
    };
  }
}