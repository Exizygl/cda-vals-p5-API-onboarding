import { UtilisateurDto } from '../dto/utilisateur.dto';
import { Utilisateur } from '../utilisateur.entity';

export interface IUtilisateurService {
  create(dto: UtilisateurDto): Promise<Utilisateur>;

}
