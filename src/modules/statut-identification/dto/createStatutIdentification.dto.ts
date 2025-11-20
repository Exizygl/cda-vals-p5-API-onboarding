import { IsString, Matches, IsNotEmpty, Length, IsBoolean} from 'class-validator';

export class CreateStatutIdentificationDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @Matches(/^[\p{L}\s'-]+$/u, {
    message: 'Le libelle ne doit contenir que des lettres, espaces, apostrophes ou tirets.',
  })
  libelle: string;
}