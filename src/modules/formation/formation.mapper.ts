import { Formation } from './formation.entity';
import { CreateFormationDto } from './dto/createFormation.dto';
import { UpdateFormationDto } from './dto/updateFormation.dto';

export class FormationMapper {
  static fromCreateDto(dto: CreateFormationDto): Formation {
    const formation = new Formation();
    formation.id = dto.id;
    formation.nom = dto.nom;
    formation.actif = dto.actif;
    return formation;
  }

  static fromUpdateDto(dto: UpdateFormationDto, existingFormation: Formation): Formation {
    if (dto.nom !== undefined) {
      existingFormation.nom = dto.nom;
    }
    if (dto.actif !== undefined) {
      existingFormation.actif = dto.actif;
    }
    return existingFormation;
  }
}
