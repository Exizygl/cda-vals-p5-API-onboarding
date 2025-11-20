import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Utilisateur } from './utilisateur.entity';
import { CreateUtilisateurDto } from './dto/createUtilisateur.dto';
import { IUtilisateurService } from './interfaces/IUtilisateurService';
import { IRoleServiceToken } from '../role/role.constants';
import { IRoleService }from '../role/interface/IRoleService';
import { UpdateUtilisateurDto } from './dto/updateUtilisateur.dto';
import { UtilisateurMapper } from './utilisateur.mapper';
import { UpdateRolesUtilisateurDto } from './dto/updateRolesUtilisateur.dto';

@Injectable()
export class UtilisateurService implements IUtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
    
    @Inject(IRoleServiceToken)
    private readonly roleService: IRoleService,
  ) {}

  async create(dto: CreateUtilisateurDto): Promise<Utilisateur> {

    const existingUser = await this.utilisateurRepository.findOne({ where: { id: dto.id } });
    if (existingUser) {
    throw new ConflictException('Utilisateur avec ce snowflake trouver.');
    }
    
    const roles = await this.roleService.findByIds(dto.rolesId);

    if (roles.length !== dto.rolesId.length) {
      const foundIds = roles.map((r) => r.id);
      const missing = dto.rolesId.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Role(s) pas trouver: ${missing.join(', ')}`);
    }
      const utilisateur = UtilisateurMapper.fromCreateDto(dto, roles);

      return this.utilisateurRepository.save(utilisateur);
  }

    async update(id: string, dto: UpdateUtilisateurDto): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurRepository.findOne({ where: { id } });

    if (!utilisateur) {
    throw new NotFoundException(`Utilisateur avec l'id ${id} introuvable`);
    }

    const updatedFields = UtilisateurMapper.fromUpdateDto(dto);
    const updated = this.utilisateurRepository.merge(utilisateur, updatedFields);

    return this.utilisateurRepository.save(updated);
    }

    async addRoles(id: string,  dto: UpdateRolesUtilisateurDto): Promise<Utilisateur> {
    const rolesId = UtilisateurMapper.fromUpdateRolesDto(dto);
    
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur not found');
    }

    const rolesToAdd = await this.roleService.findByIds(rolesId);

    const foundRoleIds = rolesToAdd.map(role => role.id);
    const missingRoles = rolesId.filter(id => !foundRoleIds.includes(id));
    if (missingRoles.length > 0) {
      throw new NotFoundException(`Role(s) pas trouver: ${missingRoles.join(', ')}`);
    }

    utilisateur.roles = [
  ...(utilisateur.roles || []), 
  ...rolesToAdd.filter(role => 
    !utilisateur.roles?.some(existing => existing.id === role.id)
  )
];
    return this.utilisateurRepository.save(utilisateur);
  }

  async removeRoles(id: string, dto : UpdateRolesUtilisateurDto): Promise<Utilisateur> {
   const rolesId = UtilisateurMapper.fromUpdateRolesDto(dto);
  const utilisateur = await this.utilisateurRepository.findOne({
    where: { id },
    relations: ['roles'],
  });

  if (!utilisateur) {
    throw new NotFoundException('Utilisateur not found');
  }

  
  const roles = await this.roleService.findByIds(rolesId);
  const foundIds = roles.map(role => role.id);
  const notFound = rolesId.filter(id => !foundIds.includes(id));

  if (notFound.length > 0) {
    throw new NotFoundException(`Role(s) not found: ${notFound.join(', ')}`);
  }

 
  utilisateur.roles = (utilisateur.roles || []).filter(
    role => !rolesId.includes(role.id)
  );

  return this.utilisateurRepository.save(utilisateur);
}

}
