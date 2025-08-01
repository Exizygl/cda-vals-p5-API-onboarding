import { Identification } from '../identification/identification.entity';
import { Role } from '../role/role.entity';
import { UtilisateurDto } from './dto/utilisateur.dto';
import { Utilisateur } from './utilisateur.entity';

export class UtilisateurMapper {
  static toEntity(dto: UtilisateurDto): Utilisateur {
    const utilisateur = new Utilisateur();
    utilisateur.id = dto.id
    utilisateur.nom = dto.nom;
    utilisateur.prenom = dto.prenom;
    utilisateur.roles = dto.roles;
    utilisateur.identifications = dto.identifications;

    return utilisateur;
  }

  static toPublic(entity: Utilisateur) {
    return {
      id: entity.id,
      nom: entity.nom,
      prenom: entity.prenom,
      roles: entity.roles,
      identifications: entity.identifications
    };
  }
}
