import { StatutPromo } from './statutPromo.entity';
import { CreateStatutPromoDto } from './dto/createStatutPromo.dto';
import { UpdateStatutPromoDto } from './dto/updateStatutPromo.dto';

export class StatutPromoMapper {
  static fromCreateDto(dto: CreateStatutPromoDto): StatutPromo {
    const statutPromo = new StatutPromo();
    statutPromo.libelle = dto.libelle;
    return statutPromo;
  }

  static fromUpdateDto(dto: UpdateStatutPromoDto, existingStatutPromo: StatutPromo): StatutPromo {
    if (dto.libelle !== undefined) {
      existingStatutPromo.libelle = dto.libelle;
    }
    return existingStatutPromo;
  }
}
