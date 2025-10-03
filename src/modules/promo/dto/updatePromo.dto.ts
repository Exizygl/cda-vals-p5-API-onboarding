import { Identification } from "src/modules/identification/identification.entity";
import { StatutPromo } from "src/modules/statut-promo/statutPromo.entity";

export class UpdatePromoDto {
    id: string;
    nom?: string;
    dateDebut?: Date;
    dateFin?: Date;
    snowflake?: string;
    statut?: StatutPromo;
    identification?: Identification;
}
