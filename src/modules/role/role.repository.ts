import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  async findOne(id: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { id } });
  }

  async create(user: Role): Promise<Role> {
    return this.roleRepo.save(user);
  }
}