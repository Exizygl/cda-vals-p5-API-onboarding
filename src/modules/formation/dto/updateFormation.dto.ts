import { IsString, Matches, Length, IsBoolean, IsOptional } from 'class-validator';

export class UpdateFormationDto {
  @IsString()
  @Length(1, 50)
  @Matches(/^[\p{L}\s'-]+$/u, {
    message: 'Le nom ne doit contenir que des lettres, espaces, apostrophes ou tirets.',
  })
  @IsOptional()
  nom?: string;

  @IsBoolean()
  @IsOptional()
  actif?: boolean;
}
