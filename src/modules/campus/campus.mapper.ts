import { Campus } from './campus.entity';
import { CreateCampusDto } from './dto/createCampus.dto';
import { UpdateCampusDto } from './dto/updateCampus.dto';

export class CampusMapper {
  static fromCreateDto(dto: CreateCampusDto): Campus {
    const campus = new Campus();
    campus.id = dto.id;
    campus.nom = dto.nom;
    campus.actif = dto.actif;
    return campus;
  }

  static fromUpdateDto(dto: UpdateCampusDto, existingCampus: Campus): Campus {
    if (dto.nom !== undefined) {
      existingCampus.nom = dto.nom;
    }
    if (dto.actif !== undefined) {
      existingCampus.actif = dto.actif;
    }
    return existingCampus;
  }
}
