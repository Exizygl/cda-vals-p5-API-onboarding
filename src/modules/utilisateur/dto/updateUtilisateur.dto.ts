import {
  IsString,
  Matches,
  Length,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdateUtilisateurDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Matches(/^[\p{L}\s'-]+$/u, {
    message:
      'Le nom ne doit contenir que des lettres, espaces, apostrophes ou tirets.',
  })
  nom?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Matches(/^[\p{L}\s'-]+$/u, {
    message:
      'Le prénom ne doit contenir que des lettres, espaces, apostrophes ou tirets.',
  })
  prenom?: string;

}