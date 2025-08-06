import { IsArray, IsString, Matches } from 'class-validator';

export class UpdateRolesUtilisateurDto {
  @IsArray()
  @IsString({ each: true })
  @Matches(/^\d+$/, {
    message: 'Chaque rôle doit être un ID Discord valide.',
    each: true,
  })
  rolesId: string[];
}
