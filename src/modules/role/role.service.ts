import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Role } from './role.entity';
import { IRoleService } from './interface/IRoleService';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { RoleMapper } from './role.mapper';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findByIds(ids: string[]): Promise<Role[]> {
    return this.roleRepository.find({ where: { id: In(ids) } });
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findSelectionnable(): Promise<Role[]> {
    return this.roleRepository.find({ where: { selectionnable: true } });
  }
  
  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role avec l'id ${id} introuvable`);
    }
    return role;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const role = RoleMapper.fromCreateDto(dto);
    return this.roleRepository.save(role);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { id } });
    if (!existingRole) {
      throw new NotFoundException(`Role avec l'id ${id} introuvable`);
    }

    const updatedRole = RoleMapper.fromUpdateDto(dto, existingRole);
    return this.roleRepository.save(updatedRole);
  }

  async remove(id: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role avec l'id ${id} introuvable`);
    }
    await this.roleRepository.remove(role);
  }
}
