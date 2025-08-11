import { CreatePromoDto } from './dto/createPromo.dto';
import { UpdatePromoDto } from './dto/updatePromo.dto';
import { Promo } from './promo.entity';
import { StatutPromo } from '../statut-promo/statutPromo.entity';
import { Identification } from '../identification/identification.entity';

export class PromoMapper {
 
  static fromCreateDto(dto: CreatePromoDto, statutPromoEntity?: StatutPromo): Promo {
    const promo = new Promo();
    promo.nom = dto.nom;
    promo.dateDebut = dto.dateDebut;
    promo.dateFin = dto.dateFin;
     if (statutPromoEntity) {
      promo.statutPromo = statutPromoEntity;
    }
    return promo;
  }

  static mergeFromUpdateDto(existing: Promo, dto: UpdatePromoDto, statutPromoEntity?: StatutPromo, identificationEntity?: Identification): Promo {
    if (dto.nom !== undefined) existing.nom = dto.nom;
    if (dto.dateDebut !== undefined) existing.dateDebut = dto.dateDebut;
    if (dto.dateFin !== undefined) existing.dateFin = dto.dateFin;
    if (dto.snowflake !== undefined) existing.snowflake = dto.snowflake;

    if (statutPromoEntity !== undefined) {
      existing.statutPromo = statutPromoEntity;
    } else if (dto.statut !== undefined) {
      existing.statutPromo = dto.statut;
    }

    if (identificationEntity !== undefined) {
      existing.identifications = [identificationEntity];
    } else if (dto.identification !== undefined) {
      existing.identifications = [dto.identification];
    }

    return existing;
  }
}
