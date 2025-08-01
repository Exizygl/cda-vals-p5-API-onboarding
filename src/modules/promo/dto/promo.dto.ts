import { Identification } from "src/modules/identification/identification.entity";
import { StatutPromo } from "src/modules/statut-promo/statut-promo.entity";




export class PromoDto {
  id: string;
  nom: string;
  dateDebut: Date;
  dateFin: Date;
  snowflake: string;
  statut: StatutPromo;
  identification: Identification;

}
