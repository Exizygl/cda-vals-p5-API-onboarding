import { RoleDto } from "./dto/role.dto";
import { Role } from "./role.entity";

export class RoleMapper {
  static toEntity(dto: RoleDto): Role {
    const role = new Role();

    return role;
  }

  static toPublic(entity: Role) {
    return {
     
    };
  }
}
