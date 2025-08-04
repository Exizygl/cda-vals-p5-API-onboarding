import { Identification } from '../identification/identification.entity';
import { Role } from '../role/role.entity';
import { CreateUtilisateurDto } from './dto/createUtilisateur.dto';
import { Utilisateur } from './utilisateur.entity';

export class UtilisateurMapper {
  static toEntity(dto: CreateUtilisateurDto): Utilisateur {
    const utilisateur = new Utilisateur();
    utilisateur.id = dto.id
    utilisateur.nom = dto.nom;
    utilisateur.prenom = dto.prenom;
    utilisateur.roles = dto.rolesId?.map(roleid => {
      const role = new Role();
      role.id = roleid;
      return role;
    }) ?? [];
    utilisateur.identifications = [];

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
