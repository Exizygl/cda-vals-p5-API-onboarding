import { IsString, IsDate, IsNumber, IsNotEmpty, Length, Matches } from 'class-validator';

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

  @IsString()
  @Matches(/^\d+$/, { message: 'Id doit avoir que des characteres numérique' })
  @IsNotEmpty()
  formationId: string;

  @IsString()
  @Matches(/^\d+$/, { message: 'Id doit avoir que des characteres numérique' })
  @IsNotEmpty()
  campusId: string;
}