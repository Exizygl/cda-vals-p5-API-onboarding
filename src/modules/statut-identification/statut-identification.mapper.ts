import { StatutIdentificationDto } from "./dto/statut-identification.dto";
import { StatutIdentification } from "./statut-identification.entity";

export class StatutIdentificationMapper {
  static toEntity(dto: StatutIdentificationDto): StatutIdentification {
    const role = new StatutIdentification();

    return role;
  }

  static toPublic(entity: StatutIdentification) {
    return {
     
    };
  }
}