import { Identification } from "src/modules/identification/identification.entity";
import { Role } from "src/modules/role/role.entity";
import { IsString, Matches, IsNotEmpty, Length, IsArray, ValidateNested,  IsOptional} from 'class-validator';
import { IdentificationDto } from "src/modules/identification/dto/createIdentification.dto";
import { Type } from "class-transformer";

export class CreateUtilisateurDto {
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

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @Matches(/^[\p{L}\s'-]+$/u, {
    message: 'Le nom ne doit contenir que des lettres, espaces, apostrophes ou tirets.',
  })
  prenom: string;

  @IsArray()
  @IsString({ each: true })
  @Matches(/^\d+$/, {
    message: 'Chaque rôle doit être un ID Discord valide.',
    each: true,
  })
  rolesId: string[];

  

}
