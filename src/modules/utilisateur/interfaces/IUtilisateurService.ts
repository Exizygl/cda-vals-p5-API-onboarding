import { CreateUtilisateurDto } from '../dto/createUtilisateur.dto';
import { UpdateUtilisateurDto } from '../dto/updateUtilisateur.dto';
import { UpdateRolesUtilisateurDto } from '../dto/updateRolesUtilisateur.dto';
import { Utilisateur } from '../utilisateur.entity';

export interface IUtilisateurService {
  create(dto: CreateUtilisateurDto): Promise<Utilisateur>;
  update(id: string, dto: UpdateUtilisateurDto): Promise<Utilisateur>;
  addRoles(id: string, dto: UpdateRolesUtilisateurDto): Promise<Utilisateur>;
  removeRoles(id: string, dto: UpdateRolesUtilisateurDto): Promise<Utilisateur>;
}