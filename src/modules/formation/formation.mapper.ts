import { FormationDto } from './dto/formation.dto';
import { Formation } from './formation.entity';



export class FormationMapper {
  static toEntity(dto: FormationDto): Formation {
    const formation = new Formation();
    formation.id = dto.id
    formation.nom = dto.nom;
    formation.actif= dto.actif;

    return formation;
  }

  static toPublic(entity: Formation) {
    return {
      id: entity.id,
      nom: entity.nom,
      actif: entity.actif
    };
  }
}
