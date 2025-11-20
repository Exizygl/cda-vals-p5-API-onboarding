import { StatutIdentification } from './statutIdentification.entity';
import { CreateStatutIdentificationDto } from './dto/createStatutIdentification.dto';
import { UpdateStatutIdentificationDto } from './dto/updateStatutIdentification.dto';

export class StatutIdentificationMapper {
  static fromCreateDto(dto: CreateStatutIdentificationDto): StatutIdentification {
    const statutIdentification = new StatutIdentification();
    statutIdentification.libelle = dto.libelle;
    return statutIdentification;
  }

  static fromUpdateDto(dto: UpdateStatutIdentificationDto, existingStatutIdentification: StatutIdentification): StatutIdentification {
    if (dto.libelle !== undefined) {
      existingStatutIdentification.libelle = dto.libelle;
    }
    return existingStatutIdentification;
  }
}