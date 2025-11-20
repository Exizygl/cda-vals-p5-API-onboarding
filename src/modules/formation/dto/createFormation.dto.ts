import { IsString, Matches, IsNotEmpty, Length, IsBoolean} from 'class-validator';

export class CreateFormationDto {
  @IsString()
  @Matches(/^\d+$/, { message: 'Id doit avoir que des characteres numérique' })
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @Matches(/^[\p{L}\s'-]+$/u, {
    message: 'Le nom ne doit contenir que des lettres, espaces, apostrophes ou tirets.',
  })
  nom: string;
  
  @IsBoolean()
  @IsNotEmpty()
  actif: boolean

}
