import { RoleDto } from '../dto/role.dto';
import { Role } from '../role.entity';


export interface IRoleService {
      create(dto: RoleDto): Promise<Role>;
      findByIds(ids: string[]): Promise<Role[]> 
  
}