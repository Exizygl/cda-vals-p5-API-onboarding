import { Role } from './role.entity';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

export class RoleMapper {
  static fromCreateDto(dto: CreateRoleDto): Role {
    const role = new Role();
    role.id = dto.id;
    role.nom = dto.nom;
    role.selectionnable = dto.selectionnable;
    return role;
  }

  static fromUpdateDto(dto: UpdateRoleDto, existingRole: Role): Role {
    if (dto.nom !== undefined) {
      existingRole.nom = dto.nom;
    }
    if (dto.selectionnable !== undefined) {
      existingRole.selectionnable = dto.selectionnable;
    }
    return existingRole;
  }
}
