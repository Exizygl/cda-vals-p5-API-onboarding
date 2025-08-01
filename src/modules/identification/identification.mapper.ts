import { IdentificationDto } from './dto/identification.dto';
import { Identification } from './identification.entity';



export class IdentificationMapper {
  static toEntity(dto: IdentificationDto): Identification {
    const identification = new Identification();

    return identification;
  }

  static toPublic(entity: Identification) {
    return {
     
    };
  }
}
