import { Identification } from "src/modules/identification/identification.entity";
import { Role } from "src/modules/role/role.entity";

export class UtilisateurDto {
  id: string;
  nom: string;
  prenom: string;
  roles: Role[];
  identifications: Identification[];
}
