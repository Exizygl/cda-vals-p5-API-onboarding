import { Role } from '../role.entity';
import { CreateRoleDto } from '../dto/createRole.dto';
import { UpdateRoleDto } from '../dto/updateRole.dto';

export interface IRoleService {
  findByIds(ids: string[]): Promise<Role[]>;
  findAll(): Promise<Role[]>;
  findSelectionnable(): Promise<Role[]>;
  findOne(id: string): Promise<Role>;
  create(dto: CreateRoleDto): Promise<Role>;
  update(id: string, dto: UpdateRoleDto): Promise<Role>;
  remove(id: string): Promise<void>;
}
