import { IsOptional, IsString, IsDateString } from 'class-validator';
import { Identification } from "../../identification/identification.entity";
import { StatutPromo } from "../../statut-promo/statutPromo.entity";

export class UpdatePromoDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsDateString()
  dateDebut?: Date;

  @IsOptional()
  @IsDateString()
  dateFin?: Date;

  @IsOptional()
  @IsString()
  snowflake?: string;

  @IsOptional()
  statut?: StatutPromo;

  @IsOptional()
  identification?: Identification;
}