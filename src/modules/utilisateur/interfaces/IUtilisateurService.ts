import { CreateUtilisateurDto } from '../dto/createUtilisateur.dto';
import { Utilisateur } from '../utilisateur.entity';

export interface IUtilisateurService {
  create(dto: CreateUtilisateurDto): Promise<Utilisateur>;

}
