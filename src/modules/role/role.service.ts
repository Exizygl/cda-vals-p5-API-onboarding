import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, In} from 'typeorm';
import { Role } from './role.entity';
import { IRoleService } from './interface/IRoleService';
import { RoleDto } from './dto/role.dto';


@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findByIds(ids: string[]): Promise<Role[]> {
    return this.roleRepository.find({ where: { id: In(ids) } });
  }

  async create(dto: RoleDto): Promise<Role> {
    const role = this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }
}