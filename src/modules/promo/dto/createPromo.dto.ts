import { IsString, IsDate, IsNumber, IsNotEmpty, Length } from 'class-validator';

export class CreatePromoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nom: string;

  @IsNotEmpty()
  @IsDate()
  dateDebut: Date;

  @IsNotEmpty()
  @IsDate()
  dateFin: Date;

  @IsNotEmpty()
  @IsNumber()
  statutId: number;

}
