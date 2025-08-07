import { ConfigBotDto } from "./dto/config-bot.dto";
import { ConfigBot } from "./config-bot.entity";

export class ConfigBotMapper {
  static toEntity(dto: ConfigBotDto): ConfigBot {
    const entity = new ConfigBot();
    entity.configId = dto.configId;
    entity.salonArriveeId = dto.salonArriveeId;
    entity.nouvelArrivantRoleId = dto.nouvelArrivantRoleId;
    entity.salonIdentificationId = dto.salonIdentificationId;
    entity.salonIdentificationStaffId = dto.salonIdentificationStaffId;
    entity.apprenantRoleId = dto.apprenantRoleId;
    entity.alumniRoleId = dto.alumniRoleId;
    entity.formateurRoleId = dto.formateurRoleId;
    entity.staffRoleId = dto.staffRoleId;
    entity.templateCategorieId = dto.templateCategorieId;
    entity.templateApprenantRoleId = dto.templateApprenantRoleId;
    entity.templateAlumniRoleId = dto.templateAlumniRoleId;
    entity.templateFormateurRoleId = dto.templateFormateurRoleId;
    entity.dateCreation = dto.dateCreation;
    entity.dateModification = dto.dateModification;
    return entity;
  }

  static toPublic(entity: ConfigBot): ConfigBotDto {
    return {
      configId: entity.configId,
      salonArriveeId: entity.salonArriveeId,
      nouvelArrivantRoleId: entity.nouvelArrivantRoleId,
      salonIdentificationId: entity.salonIdentificationId,
      salonIdentificationStaffId: entity.salonIdentificationStaffId,
      apprenantRoleId: entity.apprenantRoleId,
      alumniRoleId: entity.alumniRoleId,
      formateurRoleId: entity.formateurRoleId,
      staffRoleId: entity.staffRoleId,
      templateCategorieId: entity.templateCategorieId,
      templateApprenantRoleId: entity.templateApprenantRoleId,
      templateAlumniRoleId: entity.templateAlumniRoleId,
      templateFormateurRoleId: entity.templateFormateurRoleId,
      dateCreation: entity.dateCreation,
      dateModification: entity.dateModification,
    };
  }
}