import { Identification } from '../identification/identification.entity';
import { Role } from '../role/role.entity';
import { CreateUtilisateurDto } from './dto/createUtilisateur.dto';
import { UpdateUtilisateurDto } from './dto/updateUtilisateur.dto';
import { Utilisateur } from './utilisateur.entity';
import { UpdateRolesUtilisateurDto } from './dto/updateRolesUtilisateur.dto';

export class UtilisateurMapper {
  static fromCreateDto(dto: CreateUtilisateurDto, roles: Role[]): Utilisateur {
    const utilisateur = new Utilisateur();
    utilisateur.id = dto.id;
    utilisateur.nom = dto.nom;
    utilisateur.prenom = dto.prenom;
    utilisateur.roles = roles;
    return utilisateur;
  }


  static fromUpdateDto(dto: UpdateUtilisateurDto): Partial<Utilisateur> {
    const utilisateur = new Utilisateur();
    if (dto.nom !== undefined) utilisateur.nom = dto.nom;
    if (dto.prenom !== undefined) utilisateur.prenom = dto.prenom;
    return utilisateur;
}


  static fromUpdateRolesDto(dto: UpdateRolesUtilisateurDto): string[] {
    return dto.rolesId;
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
