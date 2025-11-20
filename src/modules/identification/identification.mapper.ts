import { CreateIdentificationDto } from './dto/createIdentification.dto';
import { UpdateIdentificationDto } from './dto/updateIdentification.dto';
import { Identification } from './identification.entity';
import { Promo } from '../promo/promo.entity';
import { Utilisateur } from '../utilisateur/utilisateur.entity';
import { StatutIdentification } from '../statut-identification/statutIdentification.entity';

export class IdentificationMapper {
  static fromCreateDto(dto: CreateIdentificationDto): Identification {
    const identification = new Identification();
    identification.statutIdentification = { id: dto.statutIdentificationId } as StatutIdentification;
    identification.promo = { id: dto.promoId } as Promo;
    identification.utilisateur = { id: dto.utilisateurId } as Utilisateur;

    return identification;
  }

  static mergeFromUpdateDto(existing: Identification, dto: UpdateIdentificationDto): Identification {

    if (dto.statutIdentificationId !== undefined) {
      existing.statutIdentification = { id: dto.statutIdentificationId } as StatutIdentification;
    }

    return existing;
  }
}
