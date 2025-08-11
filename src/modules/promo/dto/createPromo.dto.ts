import { IsString, IsDate, IsNumber } from 'class-validator';

export class CreatePromoDto {
  @IsString()
  nom: string;

  @IsDate()
  dateDebut: Date;

  @IsDate()
  dateFin: Date;

  @IsNumber()
  statutId: number;

}
