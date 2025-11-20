import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreatePromoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nom: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateDebut: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateFin: Date;

  @IsString()
  @Matches(/^\d+$/, { message: 'Id doit avoir que des characteres numérique' })
  @IsNotEmpty()
  formationId: string;

  @IsString()
  @Matches(/^\d+$/, { message: 'Id doit avoir que des characteres numérique' })
  @IsNotEmpty()
  campusId: string;
}