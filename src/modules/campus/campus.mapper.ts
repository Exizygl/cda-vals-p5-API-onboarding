import { CampusDto } from './dto/campus.dto';
import { Campus } from './campus.entity';

export class CampusMapper {
  static toEntity(dto: CampusDto): Campus {
    const campus = new Campus();
    campus.id = dto.id
    campus.nom = dto.nom;
    campus.actif= dto.actif;

    return campus;
  }

  static toPublic(entity: Campus) {
    return {
      id: entity.id,
      nom: entity.nom,
      actif: entity.actif
    };
  }
}
